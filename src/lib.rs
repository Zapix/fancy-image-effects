mod utils;
mod loader;
use std::borrow::Cow;

use wasm_bindgen::prelude::*;
use web_sys::{HtmlCanvasElement, HtmlDivElement};
use wgpu::util::DeviceExt;

use loader::fetch_image;

const CELLS_SIZE: i32 = 32;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn render_canvas(container: HtmlDivElement) {
    let width = container.client_width();
    let height = container.client_height();
    let message = format!("Container size: {}x{}", width, height);
    container.set_text_content(Some(&message.as_str()));
}

#[wasm_bindgen]
struct Application {
    surface: wgpu::Surface,
    device: wgpu::Device,
    queue: wgpu::Queue,
    resolution_buffer: wgpu::Buffer,
    resolution_bind_group: wgpu::BindGroup,
    render_pipeline: wgpu::RenderPipeline,
    container: HtmlDivElement,

    value: f32,
}

#[wasm_bindgen]
impl Application {
    pub async fn new(container: web_sys::HtmlDivElement, image_url: String) -> Self {
        let value = 0.0 as f32;
        let window = web_sys::window().expect("Window does not exist");
        let document = window.document().expect("Can not get document");
        let width = container.client_width() as u32;
        let height = container.client_height() as u32;

        let image = fetch_image(image_url.as_str()).await.expect("Can not load image");

        let canvas = document
            .create_element("canvas")
            .unwrap()
            .dyn_into::<HtmlCanvasElement>()
            .expect("Can not create canvas");
        let style_string = format!("width: {}px; height: {}px", width, height);
        canvas
            .set_attribute("style", &style_string.as_str())
            .unwrap();
        container.append_child(&canvas).unwrap();

        let instance = wgpu::Instance::default();
        let surface = instance
            .create_surface_from_canvas(canvas)
            .expect("Can not create surface from canvas");
        let adapter = instance
            .request_adapter(&wgpu::RequestAdapterOptions {
                power_preference: Default::default(),
                force_fallback_adapter: false,
                compatible_surface: None,
            })
            .await
            .unwrap();

        let (device, queue) = adapter
            .request_device(
                &wgpu::DeviceDescriptor {
                    label: None,
                    features: wgpu::Features::empty(),
                    limits: wgpu::Limits::downlevel_webgl2_defaults(),
                },
                None,
            )
            .await
            .unwrap();

        let surface_cap = surface.get_capabilities(&adapter);
        let surface_format = surface_cap
            .formats
            .iter()
            .copied()
            .filter(|x| x.is_srgb())
            .next()
            .unwrap_or(surface_cap.formats[0]);

        let config = wgpu::SurfaceConfiguration {
            usage: wgpu::TextureUsages::RENDER_ATTACHMENT,
            format: surface_format,
            width,
            height,
            present_mode: surface_cap.present_modes[0],
            alpha_mode: surface_cap.alpha_modes[0],
            view_formats: vec![],
        };
        surface.configure(&device, &config);

        let resolution_arr = [width as f32, height as f32, CELLS_SIZE as f32, value];
        let resolution_buffer = device.create_buffer_init(&wgpu::util::BufferInitDescriptor {
            label: Some("resolution buffer"),
            contents: bytemuck::cast_slice(&resolution_arr),
            usage: wgpu::BufferUsages::UNIFORM | wgpu::BufferUsages::COPY_DST,
        });

        let resolution_bind_group_layout =
            device.create_bind_group_layout(&wgpu::BindGroupLayoutDescriptor {
                entries: &[wgpu::BindGroupLayoutEntry {
                    binding: 0,
                    visibility: wgpu::ShaderStages::VERTEX_FRAGMENT,
                    ty: wgpu::BindingType::Buffer {
                        ty: wgpu::BufferBindingType::Uniform,
                        has_dynamic_offset: false,
                        min_binding_size: None,
                    },
                    count: None,
                }],
                label: Some("resolution bind group layout"),
            });

        let resolution_bind_group = device.create_bind_group(&wgpu::BindGroupDescriptor {
            label: Some("resolution_bind_group"),
            layout: &resolution_bind_group_layout,
            entries: &[wgpu::BindGroupEntry {
                binding: 0,
                resource: resolution_buffer.as_entire_binding(),
            }],
        });

        let render_pipeline_layout =
            device.create_pipeline_layout(&wgpu::PipelineLayoutDescriptor {
                label: Some("render pipeline layout"),
                bind_group_layouts: &[&resolution_bind_group_layout],
                push_constant_ranges: &[],
            });

        let shader = device.create_shader_module(wgpu::ShaderModuleDescriptor {
            label: None,
            source: wgpu::ShaderSource::Wgsl(Cow::Borrowed(include_str!("shader.wgsl"))),
        });

        let render_pipeline = device.create_render_pipeline(&wgpu::RenderPipelineDescriptor {
            label: Some("Mesh pipeline layout"),
            layout: Some(&render_pipeline_layout),
            vertex: wgpu::VertexState {
                module: &shader,
                entry_point: "vs_main",
                buffers: &[],
            },
            fragment: Some(wgpu::FragmentState {
                module: &shader,
                entry_point: "fs_main",
                targets: &[Some(surface_format.into())],
            }),
            primitive: Default::default(),
            depth_stencil: None,
            multisample: Default::default(),
            multiview: None,
        });

        Self {
            surface,
            device,
            queue,
            resolution_buffer,
            resolution_bind_group,
            render_pipeline,
            container,

            value,
        }
    }

    pub fn set_value(&mut self, value: f32) {
        self.value = value;
        let width = self.container.client_width() as f32;
        let height = self.container.client_height() as f32;
        let resolution_arr = [width as f32, height as f32, CELLS_SIZE as f32, value];
        self.queue.write_buffer(
            &self.resolution_buffer,
            0,
            bytemuck::cast_slice(&resolution_arr),
        );
    }

    pub fn render(&mut self) {
        let frame = self
            .surface
            .get_current_texture()
            .expect("Failed to acquire next swat texture");

        let view = frame
            .texture
            .create_view(&wgpu::TextureViewDescriptor::default());

        let mut encoder = self
            .device
            .create_command_encoder(&wgpu::CommandEncoderDescriptor { label: None });
        {
            let mut render_pass = encoder.begin_render_pass(&wgpu::RenderPassDescriptor {
                label: None,
                color_attachments: &[Some(wgpu::RenderPassColorAttachment {
                    view: &view,
                    resolve_target: None,
                    ops: wgpu::Operations {
                        load: wgpu::LoadOp::Clear(wgpu::Color::GREEN),
                        store: wgpu::StoreOp::Store,
                    },
                })],
                depth_stencil_attachment: None,
                timestamp_writes: None,
                occlusion_query_set: None,
            });
            render_pass.set_pipeline(&self.render_pipeline);
            render_pass.set_bind_group(0, &self.resolution_bind_group, &[]);
            render_pass.draw(0..6, 0..1);
        };
        self.queue.submit(Some(encoder.finish()));
        frame.present();
    }
}

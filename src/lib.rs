extern crate console_error_panic_hook;
mod utils;
mod loader;
use std::borrow::Cow;

use image::{DynamicImage, GenericImageView, image_dimensions};
use wasm_bindgen::prelude::*;
use web_sys::{HtmlCanvasElement, HtmlDivElement, console};
use wgpu::util::DeviceExt;

use utils::set_panic_hook;
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
pub enum ImageShader {
    SimpleFade,
    CellFade,
}

#[wasm_bindgen]
struct Application {
    surface: wgpu::Surface,
    device: wgpu::Device,
    queue: wgpu::Queue,
    resolution_buffer: wgpu::Buffer,
    resolution_bind_group: wgpu::BindGroup,
    texture_size: wgpu::Extent3d,
    texture_bind_group_layout: wgpu::BindGroupLayout,
    texture_bind_group: wgpu::BindGroup,
    render_pipeline: wgpu::RenderPipeline,
    image_url: String,
    image: Option<DynamicImage>,
    reversed: bool,
    diffuse_texture: wgpu::Texture,
    container: HtmlDivElement,

    value: f32,
}

fn get_shader(image_shader: ImageShader) -> Cow<'static, str> {
    match image_shader {
        ImageShader::SimpleFade => Cow::Borrowed(include_str!("simple-fade.wgsl")),
        ImageShader::CellFade => Cow::Borrowed(include_str!("cell-fade.wgsl")),
    }
}

#[wasm_bindgen]
impl Application {
    pub async fn new(container: web_sys::HtmlDivElement, image_shader: ImageShader, image_url: String, reversed: bool) -> Self {
        std::panic::set_hook(Box::new(console_error_panic_hook::hook));
        set_panic_hook();

        let value = 0.0 as f32;
        let window = web_sys::window().expect("Window does not exist");
        let document = window.document().expect("Can not get document");
        let width = container.client_width() as u32;
        let height = container.client_height() as u32;

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

        let image = fetch_image(image_url.as_str()).await.expect("Can not load image");
        let (image_width, image_height)= image.dimensions();
        let image_rgba = image.to_rgba8();
        let texture_size = wgpu::Extent3d {
            width: width,
            height: height,
            depth_or_array_layers: 1,
        };
        let diffuse_texture = device.create_texture(
            &wgpu::TextureDescriptor {
                size: texture_size,
                mip_level_count: 1,
                sample_count: 1,
                dimension: wgpu::TextureDimension::D2,
                format: wgpu::TextureFormat::Rgba8UnormSrgb,
                usage: wgpu::TextureUsages::TEXTURE_BINDING | wgpu::TextureUsages::COPY_DST,
                label: Some("image texture"),
                view_formats: &[],
            }
        );
        queue.write_texture(
            wgpu::ImageCopyTexture {
                texture: &diffuse_texture,
                mip_level: 0,
                origin: wgpu::Origin3d::ZERO,
                aspect: wgpu::TextureAspect::All,
            },
            &image_rgba,
            wgpu::ImageDataLayout {
                offset: 0,
                bytes_per_row: Some(4 * image_width),
                rows_per_image: Some(image_height),
            },
            texture_size
        );

        let diffuse_texture_view = diffuse_texture.create_view(&wgpu::TextureViewDescriptor::default());
        let diffuse_sampler = device.create_sampler(
            &wgpu::SamplerDescriptor {
                address_mode_u: wgpu::AddressMode::ClampToEdge,
                address_mode_v: wgpu::AddressMode::ClampToEdge,
                address_mode_w: wgpu::AddressMode::ClampToEdge,
                mag_filter: wgpu::FilterMode::Linear,
                min_filter: wgpu::FilterMode::Nearest,
                mipmap_filter: wgpu::FilterMode::Nearest,
                ..Default::default()
            }
        );

        let texture_bind_group_layout =
            device.create_bind_group_layout(&wgpu::BindGroupLayoutDescriptor {
                entries: &[
                    wgpu::BindGroupLayoutEntry {
                        binding: 0,
                        visibility: wgpu::ShaderStages::FRAGMENT,
                        ty: wgpu::BindingType::Texture {
                            multisampled: false,
                            view_dimension: wgpu::TextureViewDimension::D2,
                            sample_type: wgpu::TextureSampleType::Float { filterable: true }
                        },
                        count: None,
                    },
                    wgpu::BindGroupLayoutEntry {
                        binding: 1,
                        visibility: wgpu::ShaderStages::FRAGMENT,
                        ty: wgpu::BindingType::Sampler(wgpu::SamplerBindingType::Filtering),
                        count: None
                    }
                ],
                label: Some("texture_bind_group_layout")
            });

        let texture_bind_group = device.create_bind_group(
            &wgpu::BindGroupDescriptor {
                layout: &texture_bind_group_layout,
                entries: &[
                    wgpu::BindGroupEntry {
                        binding: 0,
                        resource: wgpu::BindingResource::TextureView(&diffuse_texture_view),
                    },
                    wgpu::BindGroupEntry {
                        binding: 1,
                        resource: wgpu::BindingResource::Sampler(&diffuse_sampler),
                    }
                ],
                label: Some("diffuse_bind_group")
            }
        );

        let render_pipeline_layout =
            device.create_pipeline_layout(&wgpu::PipelineLayoutDescriptor {
                label: Some("render pipeline layout"),
                bind_group_layouts: &[&resolution_bind_group_layout, &texture_bind_group_layout],
                push_constant_ranges: &[],
            });

        let shader = device.create_shader_module(wgpu::ShaderModuleDescriptor {
            label: None,
            source: wgpu::ShaderSource::Wgsl(get_shader(image_shader)),
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
            texture_size,
            texture_bind_group_layout,
            texture_bind_group,
            diffuse_texture,
            render_pipeline,
            container,
            image_url,
            reversed,
            image: Some(image),

            value,
        }
    }
    fn  write_to_buffer(&self) {
        let width = self.container.client_width() as f32;
        let height = self.container.client_height() as f32;
        let resolution_arr = [
            width as f32,
            height as f32,
            if self.reversed {
                1.0
            } else {
                0.0
            },
            self.value
        ];
        self.queue.write_buffer(
            &self.resolution_buffer,
            0,
            bytemuck::cast_slice(&resolution_arr),
        );
    }

    pub fn set_value(&mut self, value: f32) {
        self.value = value;
        self.write_to_buffer();
    }

    pub fn set_reversed(&mut self, value: bool) {
        self.reversed = value;
        console::log_1(&format!("Rendering reversed: {}", self.reversed).as_str().into());
        self.write_to_buffer();
    }

    pub async fn set_image(&self, image_url: String) {
        console::log_1(&format!("Load image: {}", {image_url.as_str()}).as_str().into());
        let image = fetch_image(image_url.as_str()).await.expect("Can not load image");
        let image_rgba = image.to_rgba8();
        let (image_width, image_height) = image.dimensions();
        self.queue.write_texture(
            wgpu::ImageCopyTexture {
                texture: &self.diffuse_texture,
                mip_level: 0,
                origin: wgpu::Origin3d::ZERO,
                aspect: wgpu::TextureAspect::All,
            },
            &image_rgba,
            wgpu::ImageDataLayout {
                offset: 0,
                bytes_per_row: Some(4 * image_width),
                rows_per_image: Some(image_height),
            },
            self.texture_size
        );
        self.render();
    }

    pub fn render(&self) {
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
            render_pass.set_bind_group(1, &self.texture_bind_group, &[]);
            render_pass.draw(0..6, 0..1);
        };
        self.queue.submit(Some(encoder.finish()));
        frame.present();
    }
}

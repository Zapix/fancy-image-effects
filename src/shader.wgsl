struct ResolutionUniform {
    width: f32,
    height: f32,
    cell_size: f32, // minimum binding size should be 16 bytes
    value: f32,
}

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
}

@group(0) @binding(0)
var <uniform> resolution: ResolutionUniform;

@vertex
fn vs_main(@builtin(vertex_index) index: u32) -> VertexOutput {
    var pos = array<vec2<f32>, 6>(
        vec2<f32>(-1.0, -1.0),
        vec2<f32>(1.0, -1.0),
        vec2<f32>(1.0, 1.0),
        vec2<f32>(-1.0, -1.0),
        vec2<f32>(-1.0, 1.0),
        vec2<f32>(1.0, 1.0)
    );

    var out: VertexOutput;
    out.position = vec4<f32>(pos[index], 0.0, 1.0);

    return out;

}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    return vec4<f32>(0.0, 0.0, 0.0, resolution.value);
}
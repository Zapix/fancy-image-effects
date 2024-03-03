struct ResolutionUniform {
    width: f32,
    height: f32,
    reversed: f32, // minimum binding size should be 16 bytes
    value: f32,
}

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texcoord: vec2<f32>,
}

@group(0) @binding(0)
var <uniform> resolution: ResolutionUniform;

@group(1) @binding(0)
var t_diffuse: texture_2d<f32>;
@group(1) @binding(1)
var s_diffuse: sampler;

@vertex
fn vs_main(@builtin(vertex_index) index: u32) -> VertexOutput {
    var points = array<vec2<f32>, 6>(
        vec2<f32>(-1.0, -1.0),
        vec2<f32>(1.0, -1.0),
        vec2<f32>(1.0, 1.0),
        vec2<f32>(-1.0, -1.0),
        vec2<f32>(-1.0, 1.0),
        vec2<f32>(1.0, 1.0)
    );

    var out: VertexOutput;
    var pos = points[index];
    out.position = vec4<f32>(pos, 0.0, 1.0);

    var transform_matrix = mat3x3<f32>(
        0.5, 0.0, 0.5,
        0.0, -0.5, 0.5,
        0.0, 0.0, 1.0,
    );
    out.texcoord = (vec3<f32>(pos, 1.0) * transform_matrix).xy;

    return out;

}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    var row = floor(in.texcoord.y * 10.0);
    if (resolution.reversed != 0.0) {
        row = 9.0 - row;
    }
    var resolution_value = resolution.value * 10.0;
    if (row > resolution_value) {
        return vec4<f32>(textureSample(t_diffuse, s_diffuse, in.texcoord).rgb, 0.0);
    } else  if (row + 1.0 > resolution_value) {
        var value = resolution_value - row;
        return vec4<f32>(textureSample(t_diffuse, s_diffuse, in.texcoord).rgb, value);
    } else {
        return vec4<f32>(textureSample(t_diffuse, s_diffuse, in.texcoord).rgb, 1.0);
    }
}

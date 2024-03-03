struct ResolutionUniform {
    width: f32,
    height: f32,
    reversed: f32,
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
    var cell = floor(vec2<f32>(in.texcoord.x * 10.0, in.texcoord.y * 10.0));
    var cell_num = cell.y * 10.0 + cell.x;
    if (resolution.reversed != 0.0) {
        cell_num = 99.0 - cell_num;
    }
    var resolution_value = resolution.value * 100.0;
    if (cell_num > resolution_value) {
        return vec4<f32>(textureSample(t_diffuse, s_diffuse, in.texcoord).rgb, 0.0);
    } else  if (cell_num + 1.0 > resolution_value) {
        var value = resolution_value - cell_num;
        return vec4<f32>(textureSample(t_diffuse, s_diffuse, in.texcoord).rgb, value);
    } else {
        return vec4<f32>(textureSample(t_diffuse, s_diffuse, in.texcoord).rgb, 1.0);
    }
}

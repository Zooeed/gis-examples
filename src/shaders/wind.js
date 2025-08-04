// 风场着色器代码

// 顶点着色器
export const windVertexShader = `#version 300 es
layout(location = 0) in vec2 position;

out vec2 vUv;

void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
}
`;

// 粒子更新着色器
export const particleUpdateShader = `#version 300 es
precision highp float;

uniform sampler2D particleData;
uniform sampler2D windData;
uniform float deltaTime;
uniform float speed;

layout(location = 0) out vec4 fragColor;

vec2 getWindVelocity(vec2 pos) {
    vec2 uv = pos;
    vec4 wind = texture(windData, uv);
    return wind.xy * speed;
}

void main() {
    vec2 texCoord = gl_FragCoord.xy / vec2(textureSize(particleData, 0));
    vec4 particle = texture(particleData, texCoord);
    
    vec2 pos = particle.xy;
    vec2 vel = getWindVelocity(pos);
    
    // 更新位置
    pos += vel * deltaTime;
    
    // 边界处理
    if(pos.x < 0.0) pos.x = 1.0;
    if(pos.x > 1.0) pos.x = 0.0;
    if(pos.y < 0.0) pos.y = 1.0;
    if(pos.y > 1.0) pos.y = 0.0;
    
    fragColor = vec4(pos, vel);
}
`;

// 粒子渲染着色器
export const particleRenderShader = `#version 300 es
precision highp float;

uniform sampler2D particleData;
uniform float particleSize;
uniform float tailLength;
uniform float tailFade;

out vec4 fragColor;

void main() {
    vec2 texCoord = gl_FragCoord.xy / vec2(textureSize(particleData, 0));
    vec4 particle = texture(particleData, texCoord);
    
    vec2 pos = particle.xy;
    vec2 vel = particle.zw;
    float speed = length(vel);
    
    // 计算粒子颜色
    vec3 color = mix(
        vec3(0.0, 0.4, 1.0),  // 低速颜色
        vec3(1.0, 0.0, 0.0),  // 高速颜色
        smoothstep(0.0, 1.0, speed * 2.0)
    );
    
    // 拖尾效果
    float fade = pow(tailFade, float(gl_InstanceIndex));
    
    vec4 position = vec4(pos * 2.0 - 1.0, 0.0, 1.0);
    gl_Position = position;
    gl_PointSize = particleSize;
    fragColor = vec4(color, fade);
}
`;
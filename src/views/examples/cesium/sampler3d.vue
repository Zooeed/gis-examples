<template>
  <div class="container">
    <Map></Map>
    <div class="controls">
      <div class="control-item">
        <label>云密度</label>
        <input type="range" min="0" max="1" step="0.01" v-model="cloudDensity">
      </div>
      <div class="control-item">
        <label>光散射强度</label>
        <input type="range" min="0" max="2" step="0.01" v-model="scatteringStrength">
      </div>
      <div class="control-item">
        <label>云层高度</label>
        <input type="range" min="5000" max="15000" step="100" v-model="cloudHeight">
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * Cesium 3D体积云渲染示例
 * 使用3D纹理和自定义着色器实现体积云的渲染
 */
import Map from "@/components/Map.vue";
import { Cesium } from '@/utils/ZMap';
import { onMounted, ref, watch, onUnmounted } from "vue";
import bus from "@/utils/bus";

// 定义响应式变量
const cloudDensity = ref(0.5);
const scatteringStrength = ref(1.0);
const cloudHeight = ref(10000);

// 存储viewer和primitive引用
let viewer = null;
let cloudPrimitive = null;

// 生成3D噪声纹理数据
function generateNoiseTexture() {
  const size = 32;
  const textureData = new Float32Array(size * size * size);
  
  for (let z = 0; z < size; z++) {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const index = x + y * size + z * size * size;
        textureData[index] = Math.random();
      }
    }
  }
  
  return new Cesium.Texture({
    context: viewer.scene.context,
    width: size,
    height: size,
    depth: size,
    pixelFormat: Cesium.PixelFormat.RGBA,
    pixelDatatype: Cesium.PixelDatatype.FLOAT,
    source: {
      arrayBufferView: textureData,
      width: size,
      height: size,
      depth: size
    }
  });
}

// 体积云顶点着色器
const cloudVS = `
attribute vec3 position;
attribute vec2 st;
varying vec3 v_position;
varying vec2 v_st;

void main() {
    v_position = position;
    v_st = st;
    gl_Position = czm_modelViewProjection * vec4(position, 1.0);
}
`;

// 体积云片元着色器
const cloudFS = `
varying vec3 v_position;
varying vec2 v_st;
uniform sampler3D u_noiseTexture;
uniform float u_cloudDensity;
uniform float u_scatteringStrength;

void main() {
    vec3 rayDir = normalize(v_position - czm_viewerPositionWC);
    vec3 currentPos = v_position;
    float transmittance = 1.0;
    vec3 totalLight = vec3(0.0);
    
    for(int i = 0; i < 64; i++) {
        vec3 samplePos = currentPos * 0.0001;
        float density = texture3D(u_noiseTexture, samplePos).r * u_cloudDensity;
        
        if(density > 0.0) {
            float lightTransmittance = exp(-density * u_scatteringStrength);
            transmittance *= lightTransmittance;
            totalLight += transmittance * density * vec3(1.0);
        }
        
        currentPos += rayDir * 100.0;
    }
    
    gl_FragColor = vec4(totalLight, 1.0 - transmittance);
}
`;

// 初始化体积云
function initCloud() {
  if (!viewer) return;
  
  const noiseTexture = generateNoiseTexture();
  
  // 创建包围云层的几何体
  const geometry = new Cesium.BoxGeometry({
    vertexFormat: Cesium.VertexFormat.POSITION_AND_ST,
    maximum: new Cesium.Cartesian3(200000, 200000, cloudHeight.value),
    minimum: new Cesium.Cartesian3(-200000, -200000, cloudHeight.value - 5000)
  });
  
  // 创建自定义着色器材质
  const material = new Cesium.Material({
    fabric: {
      uniforms: {
        u_noiseTexture: noiseTexture,
        u_cloudDensity: cloudDensity.value,
        u_scatteringStrength: scatteringStrength.value
      },
      source: cloudFS
    },
    translucent: true
  });

  const appearance = new Cesium.Appearance({
    material: material,
    vertexShaderSource: cloudVS,
    renderState: {
      blending: Cesium.BlendingState.ALPHA_BLEND,
      depthTest: {
        enabled: true
      },
      depthMask: false
    }
  });
  
  // 创建primitive
  cloudPrimitive = viewer.scene.primitives.add(new Cesium.Primitive({
    geometryInstances: new Cesium.GeometryInstance({
      geometry: geometry
    }),
    appearance: appearance,
    asynchronous: false
  }));
  
  // Material uniforms are already set during creation
}

// 组件挂载时初始化
onMounted(() => {
  bus.emit("getViewer", (res) => {
    viewer = res;
    if (viewer) {
      initCloud();
    }
  });
});

// 监听参数变化
watch([cloudDensity, scatteringStrength, cloudHeight], ([newDensity, newScattering, newHeight]) => {
  if (!cloudPrimitive) return;
  
  // 更新uniform变量
  cloudPrimitive.appearance.material.uniforms = {
    ...cloudPrimitive.appearance.material.uniforms,
    u_cloudDensity: newDensity,
    u_scatteringStrength: newScattering
  };
  
  // 更新云层高度
  const geometry = new Cesium.BoxGeometry({
    vertexFormat: Cesium.VertexFormat.POSITION_AND_ST,
    maximum: new Cesium.Cartesian3(200000, 200000, newHeight),
    minimum: new Cesium.Cartesian3(-200000, -200000, newHeight - 5000)
  });
  
  cloudPrimitive.geometryInstances = new Cesium.GeometryInstance({
    geometry: geometry
  });
});

// 组件卸载时清理
onUnmounted(() => {
  if (viewer && cloudPrimitive) {
    viewer.scene.primitives.remove(cloudPrimitive);
    cloudPrimitive = null;
  }
});
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  position: relative;
}

.controls {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 5px;
  z-index: 1000;
}

.control-item {
  margin-bottom: 10px;
}

.control-item label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.control-item input {
  width: 100%;
}
</style>
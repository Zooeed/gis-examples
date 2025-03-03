<template>
	<Map></Map>
</template>

<script setup>
//fbo示例
import Map from "@/components/Map.vue";
import * as Cesium from "cesium";
import { onMounted } from "vue";
import bus from "@/utils/bus";


//获取viewer
let viewer = null;
onMounted(() => {
	bus.emit("getViewer", (res) => {
		viewer = res;
		console.log('获取到 viewer:', viewer); // 添加调试日志
		if (viewer) {
			addFbo();
		} else {
			console.warn('viewer 未正确初始化');
		}
	});
});
let addFbo = () => {
	// 创建自定义渲染阶段
	const scene = viewer.scene;
	const context = scene.context;
	const drawingBufferWidth = context.drawingBufferWidth;
	const drawingBufferHeight = context.drawingBufferHeight;

	// 1. 创建 FBO 和关联的纹理
	const colorTexture = new Cesium.Texture({
		context: context,
		width: drawingBufferWidth,
		height: drawingBufferHeight,
		pixelFormat: Cesium.PixelFormat.RGBA,
		pixelDatatype: Cesium.PixelDatatype.UNSIGNED_BYTE,
	});

	const depthStencilTexture = new Cesium.Texture({
		context: context,
		width: drawingBufferWidth,
		height: drawingBufferHeight,
		pixelFormat: Cesium.PixelFormat.DEPTH_STENCIL,
		pixelDatatype: Cesium.PixelDatatype.UNSIGNED_INT_24_8,
	});

	const fbo = new Cesium.Framebuffer({
		context: context,
		colorTextures: [colorTexture],
		depthStencilTexture: depthStencilTexture
	});

	// 2. 自定义着色器（高斯模糊效果）
	const blurShader = new Cesium.PostProcessStage({
		fragmentShader: `
        uniform sampler2D colorTexture;
        uniform vec2 delta;
        varying vec2 v_textureCoordinates;
        
        void main() {
          vec4 color = vec4(0.0);
          // 设置为50%透明度的红色
          color.rgb = vec3(1.0, 0.0, 0.0);
          color.a = 0.5;
          gl_FragColor = color;
        }
      `,
		uniforms: {
			delta: new Cesium.Cartesian2(1.0 / drawingBufferWidth, 1.0), // 水平模糊
		},
	});

	// 3. 主渲染循环
	scene.postRender.addEventListener(() => {
		// 绑定 FBO 进行离屏渲染
		context.bindFramebuffer(fbo);
		context.clear(Cesium.ClearColorBit | Cesium.ClearDepthBit);

		// 渲染场景到 FBO
		scene.render();

		// 解绑 FBO，恢复默认缓冲区
		context.bindFramebuffer(null);

		// 应用后处理（从 FBO 的纹理读取数据）
		context._us.draw({
			vertexArray: blurShader._vertexArray,
			shaderProgram: blurShader._shaderProgram,
			uniformMap: blurShader._uniforms,
			framebuffer: null, // 输出到主屏幕
			texture: fbo.colorTextures[0], // 输入 FBO 的纹理
		});
	});

	// 添加测试模型
	const entity = viewer.entities.add({
		position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
		model: {
			uri: "./model/mechanical_spider.glb", // 替换为您的模型ID
		},
	});
};
</script>

<style lang="scss" scoped></style>

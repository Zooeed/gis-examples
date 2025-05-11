<template>
	<div class="container">
		<Map></Map>
		<canvas ref="eagleEyeCanvas" id="canvas" class="eagle-eye-canvas"></canvas>
	</div>
</template>

<script setup>
/**
 * FBO示例 - 实现鹰眼视图功能
 * 使用Cesium的Framebuffer对象创建离屏渲染，实现主视图与鹰眼视图的同步显示
 */
import Map from "@/components/Map.vue";
import { Cesium } from '@/utils/ZMap';
import { onMounted, ref, onUnmounted } from "vue";
import bus from "@/utils/bus";


// 获取viewer实例
// 通过事件总线获取Cesium viewer对象，用于后续地图操作
let viewer = null;
// 创建Canvas引用
const eagleEyeCanvas = ref(null);

onMounted(() => {
	// 通过事件总线获取viewer实例
	bus.emit("getViewer", (res) => {
		viewer = res;
		console.log('获取到 viewer:', viewer); // 调试日志
		if (viewer) {
			let fbo = createFrameBuffer(viewer.scene.context);
			// viewer获取成功，初始化FBO功能
			viewer.scene.preRender.addEventListener(() => {
				renderToFboByReflectCamera(fbo, viewer.scene);
				let width = viewer.scene.context.drawingBufferWidth;
				let height = viewer.scene.context.drawingBufferHeight;
				let pixels = viewer.scene.context.readPixels({
					x: 0,
					y: 0,
					width: width,
					height: height,
					framebuffer: fbo,
				});
				let cavs = document.getElementById("canvas");
				cavs.width = width;
				cavs.height = height;
				let imgData = new ImageData(new Uint8ClampedArray(pixels), width, height);
				let ctx = cavs.getContext("2d");
				ctx.putImageData(imgData, 0, 0, 0, 0, width, height);
				ctx.translate(0, height);
				ctx.scale(1, -1);
				ctx.drawImage(cavs, 0, 0);
				cavs.style.height = (height * 0.3) + "px";
				cavs.style.width = (width * 0.3) + "px";
			})
		} else {
			console.warn('viewer 未正确初始化');
		}
	});
});

// 清理资源
onUnmounted(() => {
	if (framebuffer) {
		framebuffer.destroy();
		framebuffer = null;
	}
	if (renderLoop) {
		clearInterval(renderLoop);
		renderLoop = null;
	}
});

// 帧缓冲区和渲染循环变量
let framebuffer = null;
let eagleEyeContext = null;
let renderLoop = null;

// 初始化帧缓冲区并设置相机动画渲染
const renderToFboByReflectCamera = (fbo, scene) => {
	let context = viewer.scene.context;
	const us = context.uniformState;
	const view = scene._defaultView;
	scene._view = view;
	scene.updateFrameState();
	let frameState = viewer.scene.frameState;
	frameState.passes.render = true;
	frameState.passes.postProcess = scene.postProcessStages.hasSelected;
	let backgroundColor = Cesium.defaultValue(scene.backgroundColor, Cesium.Color.BLACK);
	if (scene._hdr) {
		backgroundColor = Cesium.Color.clone(backgroundColor, scratchBackgroundColor);
		backgroundColor.red = Cesium.Math.pow(backgroundColor.red, scene.gamma);
		backgroundColor.green = Cesium.Math.pow(backgroundColor.green, scene.gamma);
		backgroundColor.blue = Cesium.Math.pow(backgroundColor.blue, scene.gamma);
	}
	frameState.backgroundColor = backgroundColor;
	frameState.atmosphere = scene.atmosphere;
	us.update(frameState);

	scene._computeCommandList.length = 0;
	scene._overlayCommandList.length = 0;
	const viewport = view.viewport;
	viewport.x = 0;
	viewport.y = 0;
	viewport.width = context.drawingBufferWidth;
	viewport.height = context.drawingBufferHeight;
	const passState = view.passState;
	passState.framebuffer = fbo;
	passState.blendingEnabled = undefined;
	passState.scissorTest = undefined;
	passState.viewport = Cesium.BoundingRectangle.clone(viewport, passState.viewport);

	scene.updateEnvironment();
	scene.updateAndExecuteCommands(passState, backgroundColor);
	scene.resolveFramebuffers(passState);
	passState.framebuffer = undefined;

	context.endFrame();
	scene._defaultView.camera = scene.camera;
};
const createFrameBuffer = (context) => {
	let width = context.drawingBufferWidth;
	let height = context.drawingBufferHeight;
	let framebuffer = new Cesium.Framebuffer({
		context: context,
		colorTextures: [
			new Cesium.Texture({
				context: context,
				width: width,
				height: height,
				pixelFormat: Cesium.PixelFormat.RGBA,
			}),
		],
	});
	return framebuffer;
}
// 翻转图像Y轴
const flipImageY = (imageData, width, height) => {
	const flipped = eagleEyeContext.createImageData(width, height);
	const stride = width * 4;

	for (let y = 0; y < height; y++) {
		const srcOffset = (height - y - 1) * stride;
		const dstOffset = y * stride;

		for (let i = 0; i < stride; i++) {
			flipped.data[dstOffset + i] = imageData.data[srcOffset + i];
		}
	}

	return flipped;
};

</script>

<style lang="scss" scoped>
.container {
	position: relative;
	width: 100%;
	height: 100%;
}

.eagle-eye-canvas {
	position: absolute;
	top: 10px;
	right: 10px;
	border: 2px solid #3388ff;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 100;
}
</style>

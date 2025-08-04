<template>
	<Map></Map>
	<div id="panelContainer">
		<h4>粒子系统参数设置</h4>
	</div>
</template>

<script setup>
import Map from "@/components/Map.vue";
import { onMounted, ref, onUnmounted } from 'vue';
import { Cesium } from '@/utils/ZMap';
import bus from "@/utils/bus";
import * as dat from 'dat.gui';
import { NetCDFReader } from 'netcdfjs';
import { Particle3D, Vortex, getFileFields } from 'cesium-particle';

class ControlPanel {
	constructor(container, optionsChange) {
		this.options = {
			maxParticles: 500 * 500,
			particleHeight: 1000.0,
			fadeOpacity: 0.950, // how fast the particle trails fade on each frame
			dropRate: 0.003, // how often the particles move to a random place
			dropRateBump: 0.01, // drop rate increase relative to individual particle speed
			speedFactor: 0.5, // how fast the particles move
			lineWidth: 4.0,
			dynamic: true
		};

		const that = this;
		let onParticleSystemOptionsChange = function () {
			optionsChange(that.getUserInput());
		}

		let gui = new dat.GUI({ autoPlace: false });
		gui.add(that.options, 'maxParticles', 1, 1000 * 1000, 1).name("最大粒子数").onFinishChange(onParticleSystemOptionsChange);
		gui.add(that.options, 'particleHeight', 1, 10000, 1).name("粒子高度").onFinishChange(onParticleSystemOptionsChange);
		gui.add(that.options, 'fadeOpacity', 0.50, 1.00, 0.001).name("拖尾透明度").onFinishChange(onParticleSystemOptionsChange);
		gui.add(that.options, 'dropRate', 0.0, 0.1).name("重置率").onFinishChange(onParticleSystemOptionsChange);
		gui.add(that.options, 'dropRateBump', 0, 0.2).name("重置&速度关联率").onFinishChange(onParticleSystemOptionsChange);
		gui.add(that.options, 'speedFactor', 0.01, 8).name("粒子速度").onFinishChange(onParticleSystemOptionsChange);
		gui.add(that.options, 'lineWidth', 0.01, 16.0).name("线宽").onFinishChange(onParticleSystemOptionsChange);
		gui.add(that.options, 'dynamic').name("动态运行").onFinishChange(onParticleSystemOptionsChange);

		let panelContainer = document.getElementById(container);
		gui.domElement.classList.add('controlPanel');
		panelContainer.appendChild(gui.domElement);
	}

	getUserInput() {
		return this.options
	}
};


let viewer = null;
let particleObj = null;



// 粒子系统配置
const systemOptions = {
	maxParticles: 64 * 64,
	particleHeight: 1000.0,
	fadeOpacity: 0.996,
	dropRate: 0.003,
	dropRateBump: 0.01,
	speedFactor: 1.0,
	lineWidth: 4.0,
	dynamic: true
}

// 粒子颜色色带
const colorTable = [
	[0.015686,
		0.054902,
		0.847059],
	[0.125490,
		0.313725,
		1.000000],
	[0.254902,
		0.588235,
		1.000000],
	[0.427451,
		0.756863,
		1.000000],
	[0.525490,
		0.850980,
		1.000000],
	[0.611765,
		0.933333,
		1.000000],
	[0.686275,
		0.960784,
		1.000000],
	[0.807843,
		1.000000,
		1.000000],
	[1.000000,
		0.996078,
		0.278431],
	[1.000000,
		0.921569,
		0.000000],
	[1.000000,
		0.768627,
		0.000000],
	[1.000000,
		0.564706,
		0.000000],
	[1.000000,
		0.282353,
		0.000000],
	[1.000000,
		0.000000,
		0.000000],
	[0.835294,
		0.000000,
		0.000000],
	[0.619608,
		0.000000,
		0.000000]
]

let loadData = async (url) => {
	const response = await fetch(url);
	const arrayBuffer = await response.arrayBuffer();
	const file = new File([arrayBuffer], 'wind.nc', { type: '' });
	return file;
};

// 加载风场数据
let loadWind = (viewer) => {


	loadData("/gisdata/wind.nc").then(file => {
		console.log(file);
		console.log(Particle3D);
		particleObj?.remove()
		particleObj = new Particle3D(viewer, {
			input: file,
			colorTable: colorTable
		});
		console.log(particleObj);

		particleObj.init().then(res => {
			particleObj.show(); // 开始运行粒子系统
		})

	});

}

onMounted(() => {
	const controlPanel = new ControlPanel("panelContainer", userInput => {
		particleObj && particleObj.optionsChange(userInput);
	});
	bus.emit("getViewer", async (res) => {
		viewer = res;
		loadWind(viewer);
	});
});

</script>

<style scoped>
#panelContainer {
	border: 1px solid #fff;
	border-radius: 5px;
	padding: 10px 10px 30px;
	position: absolute;
	left: 20%;
	top: 50px;
	z-index: 3;
}
</style>
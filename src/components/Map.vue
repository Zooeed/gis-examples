<template>
	<div id="cesiumContainer"></div>
</template>
<script setup>
import * as Cesium from 'cesium'
import { CesiumMap, viewer } from '../utils/map';
import {onMounted , onUnmounted} from 'vue';
import bus from "@/utils/bus";

//初始化地图
let initMap = () => {
	let Map = new CesiumMap('cesiumContainer');
	window.Amap = Map;
};
//添加矢量底图
let addVec = () =>{
	viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
		url: "http://{s}.tianditu.gov.cn/img_c/wmts?service=wmts&request=GetTile&version=1.0.0" +

			"&LAYER=img&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +

			"&style=default&format=tiles&tk=77c07f840070a02780f4f45bfa571f0d",
		layer: "tdtImg_c",

		style: "default",

		format: "tiles",

		tileMatrixSetID: "c",

		subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],

		tilingScheme: new Cesium.GeographicTilingScheme(),

		tileMatrixLabels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19"],

		maximumLevel: 50,
		show: true
	}));
	viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
		url: "http://{s}.tianditu.gov.cn/cia_c/wmts?service=wmts&request=GetTile&version=1.0.0" +

			"&LAYER=cia&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +

			"&style=default&format=tiles&tk=77c07f840070a02780f4f45bfa571f0d",
		layer: "tdtAnnoLayer",
		style: "default",
		format: "tiles",
		tileMatrixSetID: "c",

		subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],

		tilingScheme: new Cesium.GeographicTilingScheme(),

		tileMatrixLabels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19"],

		maximumLevel: 50,

		show: true
	}));
};
//获取viewer
let getViewer = (cb) => {
	cb(viewer);
	return viewer;
};
onMounted(() => {
	initMap();
	addVec();
	bus.on('getViewer',getViewer);
});

onUnmounted(() => {
	bus.off('getViewer',getViewer);
});
</script>



<style scoped>
#cesiumContainer {
	width: 100%;
	height: 100%;
	margin: 0;
	padding: 0;
}
</style>

<template>
	<div id="cesiumContainer"></div>
</template>
<script setup>
import * as Cesium from 'cesium'
import {ZMap} from '../utils/ZMap';
import {onMounted , onUnmounted} from 'vue';
import bus from "@/utils/bus";

let Map = null;
let viewer = null;
//初始化地图
let initMap = () => {
	// Map = new ZMap('cesiumContainer');
	// console.log(Map,ZMap);
	// viewer = Map.viewer;
	viewer = new Cesium.Viewer(cesiumContainer, {
    baseLayer: Cesium.ImageryLayer.fromProviderAsync(
      Cesium.ArcGisMapServerImageryProvider.fromUrl(
        'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
      ),
      {},
    ),
    baseLayerPicker: false,   //图层选择器
    animation: false,   //左下角仪表
    fullscreenButton: false,   //全屏按钮
    geocoder: false,   //右上角查询搜索
    infoBox: false,   //信息框
    homeButton: false,   //home按钮
    sceneModePicker: false,  //3d 2d选择器
    selectionIndicator: false,  //
    timeline: false,   //时间轴
    navigationHelpButton: false,  //右上角帮助按钮
  })
  
  
  viewer._cesiumWidget._creditContainer.style.display = "none";
  viewer.scene.fog.density = 0.0001; // 雾气中水分含量
  viewer.scene.globe.enableLighting = false;
  viewer.scene.skyBox.show = false;
  //显示刷新率和帧率
  viewer.scene.debugShowFramesPerSecond = true;
  // 加载地形
  // viewer.scene.terrainProvider = Cesium.createWorldTerrainAsync()

  // 启用深度测试以确保地形正确渲染
  viewer.scene.globe.depthTestAgainstTerrain = true;
  if(Cesium.FeatureDetection.supportsImageRenderingPixelated()){//判断是否支持图像渲染像素化处理
    viewer.resolutionScale = window.devicePixelRatio;
  }
  //开启抗锯齿
  viewer.scene.fxaa = true;
  viewer.scene.postProcessStages.fxaa.enabled = true;
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

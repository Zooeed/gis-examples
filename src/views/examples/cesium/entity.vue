<template>
  <Map></Map>
</template>

<script setup>
import Map from "@/components/Map.vue";
// import * as Cesium from "cesium";
import { onMounted, onUnmounted, ref } from "vue";
import bus from "@/utils/bus";
import {Cesium} from '@/utils/ZMap';
import * as dat from 'dat.gui';

let viewer = null;
let gui = null;  // 保存GUI实例的引用

// 定义控制参数
const params = {
  // 点的属性
  pointColor: '#ff0000',
  pointSize: 10,
  // 线的属性
  lineColor: '#0000ff',
  lineWidth: 3,
  // 面的属性
  polygonColor: '#00ff00',
  polygonAlpha: 0.5
};

// 存储实体引用
const entities = {
  point: null,
  line: null,
  polygon: null
};

onMounted(() => {
  bus.emit("getViewer", (res) => {
    viewer = res;
    if (viewer) {
      addGeometry();
      setupGUI();
    } else {
      console.warn('viewer 未正确初始化');
    }
  });
});

// 修改组件卸载时的清理函数
onUnmounted(() => {
  // 清理 GUI
  if (gui) {
    gui.destroy();
    gui = null;
  }
  
  // 清理实体
  if (viewer) {
    // 移除所有实体
    console.log('entities',viewer);
    // if (entities.point) viewer.entities.remove(entities.point);
    // if (entities.line) viewer.entities.remove(entities.line);
    // if (entities.polygon) viewer.entities.remove(entities.polygon);
    
    // 清空实体引用
    entities.point = null;
    entities.line = null;
    entities.polygon = null;
  }
});

const setupGUI = () => {
  gui = new dat.GUI();
  
  // 点的控制
  const pointFolder = gui.addFolder('点');
  pointFolder.addColor(params, 'pointColor').onChange((value) => {
    if (entities.point) {
      entities.point.point.color = Cesium.Color.fromCssColorString(value);
    }
  });
  pointFolder.add(params, 'pointSize', 1, 20).onChange((value) => {
    if (entities.point) {
      entities.point.point.pixelSize = value;
    }
  });
  
  // 线的控制
  const lineFolder = gui.addFolder('线');
  lineFolder.addColor(params, 'lineColor').onChange((value) => {
    if (entities.line) {
      entities.line.polyline.material = Cesium.Color.fromCssColorString(value);
    }
  });
  lineFolder.add(params, 'lineWidth', 1, 10).onChange((value) => {
    if (entities.line) {
      entities.line.polyline.width = value;
    }
  });
  
  // 面的控制
  const polygonFolder = gui.addFolder('面');
  polygonFolder.addColor(params, 'polygonColor').onChange((value) => {
    if (entities.polygon) {
      entities.polygon.polygon.material = Cesium.Color.fromCssColorString(value).withAlpha(params.polygonAlpha);
    }
  });
  polygonFolder.add(params, 'polygonAlpha', 0, 1).onChange((value) => {
    if (entities.polygon) {
      const color = Cesium.Color.fromCssColorString(params.polygonColor).withAlpha(value);
      entities.polygon.polygon.material = color;
    }
  });

  // 默认展开所有文件夹
  pointFolder.open();
  lineFolder.open();
  polygonFolder.open();
};

const addGeometry = () => {
  // 添加点
  entities.point = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(116.39, 39.9),
    point: {
      pixelSize: params.pointSize,
      color: Cesium.Color.fromCssColorString(params.pointColor),
      outlineColor: Cesium.Color.WHITE,
      outlineWidth: 2
    },
    label: {
      text: '点示例',
      font: '14px sans-serif',
      fillColor: Cesium.Color.WHITE,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      outlineWidth: 2,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(0, -10)
    }
  });
  console.log('entities',viewer.entities);
  
  // 添加线
  entities.line = viewer.entities.add({
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArray([
        116.39, 39.9,
        116.40, 39.91,
        116.41, 39.9
      ]),
      width: params.lineWidth,
      material: Cesium.Color.fromCssColorString(params.lineColor),
      clampToGround: true
    }
  });

  // 添加面
  entities.polygon = viewer.entities.add({
    polygon: {
      hierarchy: Cesium.Cartesian3.fromDegreesArray([
        116.42, 39.92,
        116.43, 39.92,
        116.43, 39.91,
        116.42, 39.91
      ]),
      material: Cesium.Color.fromCssColorString(params.polygonColor).withAlpha(params.polygonAlpha),
      outline: true,
      outlineColor: Cesium.Color.WHITE
    }
  });

  // 设置相机位置
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(116.41, 39.91, 50000),
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-60),
      roll: 0.0
    }
  });
};
</script>

<style lang="scss" scoped>
</style>
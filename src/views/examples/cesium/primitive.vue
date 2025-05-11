<template>
    <Map id="cesiumContainer"></Map>
</template>

<script setup>
import Map from "@/components/Map.vue";
import { onMounted, ref } from 'vue';
import {Cesium} from '@/utils/ZMap';
import bus from "@/utils/bus";

let viewer = null;
let pyramidPrimitive;


// 在onMounted回调中添加四棱锥创建代码
onMounted(() => {
    bus.emit("getViewer", (res) => {
        viewer = res;
        console.log('获取到 viewer:', viewer); // 添加调试日志

        // 增大四棱锥尺寸
        const cylinder = Cesium.CylinderGeometry.createGeometry(
            new Cesium.CylinderGeometry({
                length: 20000,     // 增大高度
                topRadius: 0,
                bottomRadius: 10000, // 增大底部半径
                // slices: 4
            })
        );
        console.log(cylinder);

        // 定义四棱锥位置（杭州经纬度）
        const position = Cesium.Cartesian3.fromDegrees(120.12, 30.16, 1000000);
        const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(position);
        // 添加调试信息
        viewer.scene.debugShowFramesPerSecond = true;
        console.log('四棱锥位置:', position);
        // 创建GeometryInstance
        const instance = new Cesium.GeometryInstance({
            geometry: new Cesium.CylinderGeometry({
                length: 200000,
                topRadius: 0,
                bottomRadius: 200000,
                slices: 4
            }),
            modelMatrix: modelMatrix, // 地理坐标转换矩阵[2](@ref)
            attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(
                    Cesium.Color.fromBytes(255, 100, 100, 200) // 半透明红色
                )
            }
        });

        // 创建Primitive并添加到场景
        pyramidPrimitive = new Cesium.Primitive({
            geometryInstances: instance,
            appearance: new Cesium.PerInstanceColorAppearance({
                translucent: true,
                closed: true, // 启用背面剔除
                renderState: {
                    depthTest: { enabled: true } // 防止与地形穿透[1,6](@ref)
                }
            })
        });
        viewer.scene.primitives.add(pyramidPrimitive);
    });
});



</script>

<style scoped>
#cesiumContainer {
    width: 100%;
    height: 100%;
}
</style>
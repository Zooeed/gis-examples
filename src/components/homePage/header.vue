<template>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false"
        @select="handleSelect">
        <el-menu-item index="0">
            <img style="width: 100px" src="/src/assets/vue.svg" alt="Element logo" />
        </el-menu-item>
        <el-menu-item index="1">git</el-menu-item>
        <el-sub-menu index="2">
            <template #title>gis示例</template>
            <el-menu-item index="2-1">Cesium</el-menu-item>
            <el-menu-item index="2-2">Mapbox</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="3">
            <template #title>联系方式</template>
            <el-menu-item index="3-1">微信群聊</el-menu-item>
            <el-menu-item index="3-2">个人微信</el-menu-item>
            <el-menu-item index="3-3">Email</el-menu-item>
            <el-menu-item index="3-4">收款码</el-menu-item>
        </el-sub-menu>
    </el-menu>
</template>

<script setup>
import { ref } from 'vue';

let activeIndex = ref('2-1');

let handleSelect = (key,keypath) => {
    console.log(key,keypath);
    
};
</script>

<style lang="scss" scoped>
.el-menu--horizontal > .el-menu-item:nth-child(1) {
  margin-right: auto;
}
.el-menu--horizontal {
  --el-menu-horizontal-height: 100px;
}
</style>
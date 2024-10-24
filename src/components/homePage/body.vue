<template>
    <div class="page_body">
        <el-anchor :container="containerRef" style="overflow-y: auto" direction="vertical" type="default" :offset="30"
            @click="handleClick">
            <el-tree :data="dataSource" node-key="id" default-expand-all :expand-on-click-node="false">
                <template #default="{ node, data }">
                    <span class="custom-tree-node">
                        <el-anchor-link :href="'#part' + data.id" :title="'part' + data.id" />
                    </span>
                </template>
            </el-tree>
        </el-anchor>

        <div class="views" ref="containerRef" style="overflow-y:auto;">
            <div v-for="item in dataSource" :id="'part' + item.id" style="
                    height: auto;
                    background: rgba(255, 0, 0, 0.02);
                    margin-top: 30px;
                ">
                {{ 'part' + item.label }}
                <div v-for="child in item?.children" class="itemview" :id="'part' + child.id"
                    style="width: 300px;height: 300px;">
                    {{ 'part' + child.id }}
                </div>
            </div>
        </div>
    </div>
</template>



<script setup>
import { ref, onMounted } from 'vue'
import pageConfig from './pageConfig.js'

const containerRef = ref();

let dataSource = ref(pageConfig)
const handleClick = (e) => {
    e.preventDefault()
}

onMounted(() => {
    console.log(containerRef);
});
</script>

<style lang="scss" scoped>
.page_body {
    display: grid;
    grid-template-columns: 3fr 9fr;
    grid-template-rows: 1fr;
    overflow-x: hidden;

    .views::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 10px;
        height: 50px;
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    }
}
</style>
<template>
    <div class="page_body">
            <el-anchor :container="containerRef" style="overflow-y: auto" direction="vertical" type="default" :offset="30" @click="handleClick">
                <el-tree :data="dataSource"  node-key="id" default-expand-all :expand-on-click-node="false">
                    <template #default="{ node, data }">
                        <span class="custom-tree-node">
                            <el-anchor-link :href="'#'+data.id" :title="data.id" />
                        </span>
                    </template>
                </el-tree>
            </el-anchor>
       
            <div ref="containerRef" style="height: 300px;overflow-y:auto;">
                <div v-for="item in dataSource" :id="item.id" style="
                    height: 300px;
                    background: rgba(255, 0, 0, 0.02);
                    margin-top: 30px;
                ">
                    {{ item.label }}
                    <div v-for="child in item?.children2" class="itemview" :id="child.id" style="width: 300px;height: 300px;">
                        {{ child.label }}
                    </div>
                </div>
            </div>
    </div>
</template>



<script setup>
import { ref , onMounted} from 'vue'

const containerRef = ref();

let dataSource = ref([
    {
        id: "1",
        label: 'Level one 1',
        // children: [
        //     {
        //         id: 4,
        //         label: 'Level two 1-1',
        //     },
        // ],
    },
    {
        id: "2",
        label: 'Level one 2',
        // children: [
        //     {
        //         id: 5,
        //         label: 'Level two 2-1',
        //     },
        //     {
        //         id: 6,
        //         label: 'Level two 2-2',
        //     },
        // ],
    },
    {
        id: "3",
        label: 'Level one 3',
        // children: [
        //     {
        //         id: 7,
        //         label: 'Level two 3-1',
        //     },
        //     {
        //         id: 8,
        //         label: 'Level two 3-2',
        //     },
        // ],
    },
])
const handleClick = (e) => {
    e.preventDefault()
}

onMounted(() => {
  console.log(containerRef); 
});
</script>

<style lang="scss" scoped>
.page_body{
    display: grid;
    grid-template-columns: 3fr 9fr;
    grid-template-rows: 1fr;
}
</style>
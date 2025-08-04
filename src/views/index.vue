<template>
    <div class="layout">
        <div class="sidebar">
            <h2 class="sidebar-title">功能列表</h2>
            <ul class="menu-list">
                <li 
                    v-for="route in routes" 
                    :key="route.path"
                    :class="{ active: isActive(route.path) }"
                    @click="navigateTo(route.path)"
                >
                    {{ route.name }}
                </li>
            </ul>
        </div>
        <div class="content">
            <router-view v-slot="{ Component }">
                <transition name="fade" mode="out-in">
                    <component :is="Component" class="custom" />
                </transition>
            </router-view>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const routes = [
    { path: 'fbo', name: '离屏渲染实现鹰眼' },
    { path: 'primitive', name: 'Primitive示例' },
    { path: 'entity', name: '点线面示例(entity)' },
    { path: 'sampler3d', name: '体渲染' },
    { path: 'windy', name: '风场' },
]

// 修改为获取当前路由的最后一段
const isActive = (path) => {
    const currentPath = route.path.split('/').pop()
    return currentPath === path
}

const navigateTo = (path) => {
    router.push(path)
}
</script>

<style lang="scss" scoped>
.layout {
    display: flex;
    width: 100%;
    height: 100vh;
}

.sidebar {
    width: 200px;
    background-color: #f5f5f5;
    padding: 20px;
    border-right: 1px solid #e8e8e8;

    .sidebar-title {
        margin: 0 0 20px;
        font-size: 18px;
        color: #333;
        text-align: center;
    }

    .menu-list {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
            padding: 12px 15px;
            margin-bottom: 8px;
            cursor: pointer;
            border-radius: 4px;
            transition: all 0.3s ease;

            &:hover {
                background-color: #e6e6e6;
            }

            &.active {
                background-color: #1890ff;
                color: white;
            }
        }
    }
}

.content {
    flex: 1;
    overflow: auto;
    .custom{
        width: 100%;
        height: 100%;
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
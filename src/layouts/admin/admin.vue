<template>
    <!-- 外层容器 -->
    <el-container class="admin-shell">

        <!-- 左边侧边栏 -->
        <el-aside :width='menuStore.menuWidth' class="transition-all duration-300">
            <AdminMenu></AdminMenu>
        </el-aside>

        <!-- 右边主内容区域 -->
        <el-container>
            <!-- 顶栏容器 -->
            <el-header class="admin-header-bar">
                <AdminHeader></AdminHeader>
            </el-header>

            <el-main class="admin-main">
                <div class="admin-surface">
                    <!-- 标签导航栏 -->
                    <AdminTagList></AdminTagList>

                    <!-- 主内容（根据路由动态展示不同页面） -->
                    <router-view v-slot="{ Component }">
                        <Transition name="fade">
                            <!-- max 指定最多缓存 10 个组件 -->
                            <KeepAlive :max="10">
                                <component :is="Component"></component>
                            </KeepAlive>
                        </Transition>

                    </router-view>
                </div>
            </el-main>

            <!-- 底栏容器 -->
            <el-footer>
                <AdminFooter></AdminFooter>
            </el-footer>
        </el-container>
    </el-container>
</template>

<script setup>
// 引入组件
import AdminFooter from './components/AdminFooter.vue';
import AdminHeader from './components/AdminHeader.vue';
import AdminMenu from './components/AdminMenu.vue';
import AdminTagList from './components/AdminTagList.vue';

import { useMenuStore } from '@/stores/menu'

const menuStore = useMenuStore()
</script>

<style scoped>
.admin-shell {
    min-height: 100vh;
    background: radial-gradient(circle at 20% 20%, #e0f2fe 0, rgba(224, 242, 254, 0) 35%),
        radial-gradient(circle at 80% 0, #e0e7ff 0, rgba(224, 231, 255, 0) 40%),
        radial-gradient(circle at 50% 80%, #ede9fe 0, rgba(237, 233, 254, 0) 45%),
        #f8fafc;
}

.admin-main {
    padding: 24px;
}

.admin-surface {
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.82);
    box-shadow: 0 20px 60px rgba(79, 70, 229, 0.06), 0 10px 30px rgba(15, 23, 42, 0.05);
    border: 1px solid rgba(226, 232, 240, 0.8);
    padding: 12px 12px 24px;
    backdrop-filter: blur(18px);
}

.el-header {
    padding: 0!important;
}

.el-footer {
    padding: 0!important;
}

.admin-header-bar {
    background: transparent;
    padding: 12px 20px 0;
}

/* 内容区域过渡动画：淡入淡出效果 */
/* 刚开始进入时 */
.fade-enter-from {
    /* 透明度 */
    opacity: 0;
}

/* 刚开始结束 */
.fade-enter-to {
    opacity: 1;
}

/* 刚开始离开 */
.fade-leave-from {
  opacity: 1;
}

/* 离开已结束 */
.fade-leave-to {
  opacity: 0;
}

/* 离开进行中 */
.fade-leave-active {
    transition: all 0.3s;
}

/* 进入进行中 */
.fade-enter-active {
    transition: all 0.3s;
    transition-delay: 0.3s;
}
</style>
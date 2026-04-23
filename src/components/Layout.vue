<!-- 全局布局组件：包含顶部导航栏和路由视图 -->
<template>
  <div class="layout-container">
    <!-- 顶部导航栏 -->
    <el-header class="layout-header">
      <div class="header-left">
        <h1 class="app-title">产品池管理系统</h1>
      </div>
      <div class="header-right">
        <!-- 水平导航菜单，集成路由跳转 -->
        <el-menu
          :default-active="activeMenu"
          mode="horizontal"
          :ellipsis="false"
          router
          class="header-menu"
        >
          <el-menu-item index="/product-pool">产品池展示</el-menu-item>
          <el-menu-item index="/configuration-types">配置类型</el-menu-item>
          <el-menu-item index="/benchmarks">业绩对标</el-menu-item>
          <el-menu-item index="/strategy-types">策略类型</el-menu-item>
          <el-menu-item index="/products">产品管理</el-menu-item>
        </el-menu>
      </div>
    </el-header>

    <!-- 主体内容区域，渲染路由视图并带过渡动画 -->
    <el-main class="layout-main">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </el-main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 计算当前激活的菜单项，根据路由路径匹配
const activeMenu = computed(() => {
  return route.path
})
</script>

<style scoped>
/* 布局容器样式 */
.layout-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 顶部导航栏样式 */
.layout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
}

/* 应用标题样式 */
.app-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #fff;
}

.header-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

/* 导航菜单透明背景 */
.header-menu {
  background: transparent;
  border: none;
}

.header-menu .el-menu-item {
  color: #fff;
  border-bottom: 2px solid transparent;
}

/* 菜单项悬停效果 */
.header-menu .el-menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* 激活菜单项样式 */
.header-menu .el-menu-item.is-active {
  border-bottom-color: #fff;
  background: rgba(255, 255, 255, 0.15);
}

/* 主内容区域样式 */
.layout-main {
  flex: 1;
  padding: 20px;
  background-color: #f5f7fa;
}

/* 路由切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

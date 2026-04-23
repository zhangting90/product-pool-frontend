<template>
  <div class="layout-container">
    <!-- 顶部导航栏 -->
    <el-header class="layout-header">
      <div class="header-left">
        <h1 class="app-title">产品池管理系统</h1>
      </div>
      <div class="header-right">
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

    <!-- 主体内容 -->
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

const activeMenu = computed(() => {
  return route.path
})
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

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

.header-menu {
  background: transparent;
  border: none;
}

.header-menu .el-menu-item {
  color: #fff;
  border-bottom: 2px solid transparent;
}

.header-menu .el-menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.header-menu .el-menu-item.is-active {
  border-bottom-color: #fff;
  background: rgba(255, 255, 255, 0.15);
}

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

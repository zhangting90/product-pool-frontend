<!-- 根组件：渲染全局布局 -->
<template>
  <Layout />
</template>

<script setup lang="ts">
// 引入全局布局组件
import Layout from '@/components/Layout.vue'
</script>

<style>
/* 根元素撑满全屏 */
#app {
  height: 100%;
}
</style>

<!-- 加载状态组件：显示旋转图标和可选的加载文字 -->
<template>
  <div v-if="visible" :class="['loading-container', { fullscreen }]">
    <!-- 旋转加载图标 -->
    <el-icon class="is-loading">
      <Loading />
    </el-icon>
    <!-- 加载提示文字 -->
    <p v-if="text" class="loading-text">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
import { Loading } from '@element-plus/icons-vue'

// 组件属性定义
interface Props {
  visible: boolean    // 是否显示加载状态
  text?: string       // 加载提示文字
  fullscreen?: boolean // 是否全屏显示
}

defineProps<Props>()
</script>

<style scoped>
/* 加载容器样式 */
.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  padding: 20px;
  min-height: 100px;
}

/* 全屏加载样式 */
.loading-container.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 0;
}

/* 旋转动画 */
.is-loading {
  font-size: 40px;
  color: var(--el-color-primary);
  animation: rotating 2s linear infinite;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 加载文字样式 */
.loading-text {
  margin-top: 12px;
  color: var(--el-text-color-regular);
  font-size: 14px;
}
</style>

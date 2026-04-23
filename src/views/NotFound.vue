<!-- 404页面未找到视图 -->
<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <h1 class="error-code">404</h1>
      <h2 class="error-message">页面未找到</h2>
      <p class="error-description">抱歉，您访问的页面不存在。</p>
      <!-- 返回首页按钮 -->
      <el-button type="primary" @click="goHome" class="back-button">
        返回首页
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

// 跳转到首页
const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
/* 404页面居中容器 */
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* 白色卡片内容区域 */
.not-found-content {
  text-align: center;
  background: white;
  padding: 60px;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

/* 错误码样式 */
.error-code {
  font-size: 120px;
  font-weight: 700;
  color: #667eea;
  margin: 0;
  line-height: 1;
}

/* 错误标题样式 */
.error-message {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin: 20px 0 10px 0;
}

/* 错误描述样式 */
.error-description {
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
}

/* 返回按钮样式 */
.back-button {
  padding: 12px 32px;
  font-size: 16px;
}
</style>

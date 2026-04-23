/**
 * 应用入口文件
 * 初始化 Vue 应用，注册全局插件和组件
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import './assets/styles/global.css'

// 创建 Vue 应用实例
const app = createApp(App)

// 创建并使用Pinia状态管理
const pinia = createPinia()
app.use(pinia)

// 使用路由
app.use(router)

// 使用Element Plus UI框架
app.use(ElementPlus)

// 注册所有Element Plus图标为全局组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 挂载应用到DOM
app.mount('#app')

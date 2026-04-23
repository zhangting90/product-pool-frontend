/**
 * 路由配置文件
 * 定义应用的页面路由和导航守卫
 */
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 路由规则定义
const routes: RouteRecordRaw[] = [
  // 根路径重定向到产品池展示页
  {
    path: '/',
    redirect: '/product-pool'
  },
  // 产品池展示页
  {
    path: '/product-pool',
    name: 'ProductPool',
    component: () => import('@/views/product-pool/Display.vue'),
    meta: {
      title: '产品池展示',
      requiresAuth: false
    }
  },
  // 配置类型管理页
  {
    path: '/configuration-types',
    name: 'ConfigurationTypeList',
    component: () => import('@/views/configuration-type/List.vue'),
    meta: {
      title: '配置类型管理',
      requiresAuth: true
    }
  },
  // 业绩对标管理页
  {
    path: '/benchmarks',
    name: 'BenchmarkList',
    component: () => import('@/views/benchmark/List.vue'),
    meta: {
      title: '业绩对标管理',
      requiresAuth: true
    }
  },
  // 策略类型管理页
  {
    path: '/strategy-types',
    name: 'StrategyTypeList',
    component: () => import('@/views/strategy-type/List.vue'),
    meta: {
      title: '策略类型管理',
      requiresAuth: true
    }
  },
  // 产品管理页
  {
    path: '/products',
    name: 'ProductList',
    component: () => import('@/views/product/List.vue'),
    meta: {
      title: '产品管理',
      requiresAuth: true
    }
  },
  // 404未找到页面
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      title: '404'
    }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 全局前置路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = `${to.meta.title || '产品池'} - 产品池管理系统`

  // 检查是否需要登录
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token')
    if (!token) {
      // 未登录，跳转到登录页（如果有的话）
      // 这里暂时直接放行，实际项目中需要跳转到登录页
      console.warn('需要登录才能访问此页面')
    }
  }

  next()
})

export default router

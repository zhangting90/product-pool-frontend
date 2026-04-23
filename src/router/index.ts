import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/product-pool'
  },
  {
    path: '/product-pool',
    name: 'ProductPool',
    component: () => import('@/views/product-pool/Display.vue'),
    meta: {
      title: '产品池展示',
      requiresAuth: false
    }
  },
  {
    path: '/configuration-types',
    name: 'ConfigurationTypeList',
    component: () => import('@/views/configuration-type/List.vue'),
    meta: {
      title: '配置类型管理',
      requiresAuth: true
    }
  },
  {
    path: '/benchmarks',
    name: 'BenchmarkList',
    component: () => import('@/views/benchmark/List.vue'),
    meta: {
      title: '业绩对标管理',
      requiresAuth: true
    }
  },
  {
    path: '/strategy-types',
    name: 'StrategyTypeList',
    component: () => import('@/views/strategy-type/List.vue'),
    meta: {
      title: '策略类型管理',
      requiresAuth: true
    }
  },
  {
    path: '/products',
    name: 'ProductList',
    component: () => import('@/views/product/List.vue'),
    meta: {
      title: '产品管理',
      requiresAuth: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      title: '404'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 路由守卫
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

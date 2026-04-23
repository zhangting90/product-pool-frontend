/**
 * 产品池 Pinia Store
 * 管理产品池的全局状态，提供产品池数据的加载和刷新操作
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ProductPoolVO } from '@/types/product-pool'
import * as productPoolApi from '@/api/product-pool'

export const useProductPoolStore = defineStore('productPool', () => {
  /** 产品池层级数据 */
  const productPool = ref<ProductPoolVO[]>([])
  /** 加载状态 */
  const loading = ref(false)
  /** 错误信息 */
  const error = ref<string | null>(null)

  /**
   * 加载产品池数据
   * @param activeOnly - 是否只加载激活的产品，默认为true
   */
  const loadProductPool = async (activeOnly = true) => {
    loading.value = true
    error.value = null
    try {
      productPool.value = await productPoolApi.getProductPool(activeOnly)
    } catch (err: any) {
      error.value = err.message || '加载产品池数据失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 刷新产品池数据
   * @param activeOnly - 是否只加载激活的产品，默认为true
   */
  const refresh = async (activeOnly = true) => {
    return loadProductPool(activeOnly)
  }

  return {
    productPool,
    loading,
    error,
    loadProductPool,
    refresh
  }
})

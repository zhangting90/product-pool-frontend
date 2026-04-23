import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ProductPoolVO } from '@/types/product-pool'
import * as productPoolApi from '@/api/product-pool'

export const useProductPoolStore = defineStore('productPool', () => {
  const productPool = ref<ProductPoolVO[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * 加载产品池数据
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

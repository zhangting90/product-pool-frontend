import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ProductDTO, ProductCreateDTO, ProductUpdateDTO, PageResult } from '@/types/product'
import * as productApi from '@/api/product'

export const useProductStore = defineStore('product', () => {
  const products = ref<ProductDTO[]>([])
  const pageResult = ref<PageResult<ProductDTO>>({
    content: [],
    pageNumber: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true
  })
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * 加载产品列表（分页）
   */
  const loadProducts = async (params: {
    page?: number
    size?: number
    sortBy?: string
    sortDir?: string
  } = {}) => {
    loading.value = true
    error.value = null
    try {
      const result = await productApi.getProducts(params)
      pageResult.value = result
      products.value = result.content
      return result
    } catch (err: any) {
      error.value = err.message || '加载产品列表失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 搜索产品（分页）
   */
  const searchProducts = async (params: {
    name?: string
    code?: string
    strategyTypeId?: number
    riskLevel?: string
    isActive?: boolean
    page?: number
    size?: number
  }) => {
    loading.value = true
    error.value = null
    try {
      const result = await productApi.searchProducts(params)
      pageResult.value = result
      products.value = result.content
      return result
    } catch (err: any) {
      error.value = err.message || '搜索产品失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 根据策略类型ID加载产品（分页）
   */
  const loadByStrategyTypeId = async (strategyTypeId: number, params: {
    page?: number
    size?: number
  } = {}) => {
    loading.value = true
    error.value = null
    try {
      const result = await productApi.getProductsByStrategyTypeId(strategyTypeId, params)
      pageResult.value = result
      products.value = result.content
      return result
    } catch (err: any) {
      error.value = err.message || '加载产品失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 加载激活的产品（分页）
   */
  const loadActiveProducts = async (params: {
    page?: number
    size?: number
  } = {}) => {
    loading.value = true
    error.value = null
    try {
      const result = await productApi.getActiveProducts(params)
      pageResult.value = result
      products.value = result.content
      return result
    } catch (err: any) {
      error.value = err.message || '加载激活产品失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 根据ID获取产品
   */
  const getById = async (id: number) => {
    try {
      return await productApi.getProductById(id)
    } catch (err: any) {
      error.value = err.message || '获取产品失败'
      throw err
    }
  }

  /**
   * 创建产品
   */
  const create = async (data: ProductCreateDTO) => {
    try {
      const result = await productApi.createProduct(data)
      products.value.push(result)
      return result
    } catch (err: any) {
      error.value = err.message || '创建产品失败'
      throw err
    }
  }

  /**
   * 更新产品
   */
  const update = async (id: number, data: ProductUpdateDTO) => {
    try {
      const result = await productApi.updateProduct(id, data)
      const index = products.value.findIndex(p => p.id === id)
      if (index !== -1) {
        products.value[index] = result
      }
      return result
    } catch (err: any) {
      error.value = err.message || '更新产品失败'
      throw err
    }
  }

  /**
   * 删除产品
   */
  const remove = async (id: number) => {
    try {
      await productApi.deleteProduct(id)
      products.value = products.value.filter(p => p.id !== id)
    } catch (err: any) {
      error.value = err.message || '删除产品失败'
      throw err
    }
  }

  return {
    products,
    pageResult,
    loading,
    error,
    loadProducts,
    searchProducts,
    loadByStrategyTypeId,
    loadActiveProducts,
    getById,
    create,
    update,
    remove
  }
})

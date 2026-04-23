/**
 * 产品 Pinia Store
 * 管理产品的全局状态，提供分页查询、搜索、创建、更新、删除等操作
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ProductDTO, ProductCreateDTO, ProductUpdateDTO, PageResult } from '@/types/product'
import * as productApi from '@/api/product'

export const useProductStore = defineStore('product', () => {
  /** 当前页产品列表 */
  const products = ref<ProductDTO[]>([])
  /** 分页查询结果 */
  const pageResult = ref<PageResult<ProductDTO>>({
    content: [],
    pageNumber: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true
  })
  /** 加载状态 */
  const loading = ref(false)
  /** 错误信息 */
  const error = ref<string | null>(null)

  /**
   * 加载产品列表（分页）
   * @param params - 分页和排序参数
   * @returns 分页结果
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
   * @param params - 搜索条件和分页参数
   * @returns 分页结果
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
   * @param strategyTypeId - 策略类型ID
   * @param params - 分页参数
   * @returns 分页结果
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
   * @param params - 分页参数
   * @returns 分页结果
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
   * @param id - 产品ID
   * @returns 产品详情
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
   * @param data - 创建产品请求体
   * @returns 新创建的产品
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
   * @param id - 产品ID
   * @param data - 更新产品请求体
   * @returns 更新后的产品
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
    } finally {
      loading.value = false
    }
  }

  /**
   * 删除产品
   * @param id - 产品ID
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

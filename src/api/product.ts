/**
 * 产品 API 模块
 * 提供产品的增删改查接口，支持分页查询、搜索和按策略类型筛选
 */
import request from '@/utils/request'
import type { ProductDTO, ProductCreateDTO, ProductUpdateDTO, PageResult } from '@/types/product'

/**
 * 获取产品列表（分页）
 * @param params - 分页和排序参数
 * @returns 分页产品列表
 */
export const getProducts = (params: {
  page?: number
  size?: number
  sortBy?: string
  sortDir?: string
}) => {
  return request<PageResult<ProductDTO>>({
    url: '/api/v1/products',
    method: 'get',
    params
  })
}

/**
 * 搜索产品（分页），支持分类、业绩对标、策略类型多级筛选
 * @param params - 搜索条件和分页参数
 * @returns 分页产品列表
 */
export const searchProducts = (params: {
  name?: string
  code?: string
  configurationTypeId?: number
  benchmarkId?: number
  strategyTypeId?: number
  page?: number
  size?: number
}) => {
  return request<PageResult<ProductDTO>>({
    url: '/api/v1/products/search',
    method: 'get',
    params
  })
}

/**
 * 根据ID获取产品
 * @param id - 产品ID
 * @returns 产品详情
 */
export const getProductById = (id: string) => {
  return request<ProductDTO>({
    url: `/api/v1/products/${id}`,
    method: 'get'
  })
}

/**
 * 根据策略类型ID获取产品（分页）
 * @param strategyTypeId - 策略类型ID
 * @param params - 分页参数
 * @returns 分页产品列表
 */
export const getProductsByStrategyTypeId = (
  strategyTypeId: string,
  params: {
    page?: number
    size?: number
  }
) => {
  return request<PageResult<ProductDTO>>({
    url: `/api/v1/products/strategy-types/${strategyTypeId}`,
    method: 'get',
    params
  })
}

/**
 * 获取激活的产品（分页）
 * @param params - 分页参数
 * @returns 分页的激活产品列表
 */
export const getActiveProducts = (params: { page?: number; size?: number }) => {
  return request<PageResult<ProductDTO>>({
    url: '/api/v1/products/active',
    method: 'get',
    params
  })
}

/**
 * 创建产品
 * @param data - 创建产品请求体
 * @returns 新创建的产品
 */
export const createProduct = (data: ProductCreateDTO) => {
  return request<ProductDTO>({
    url: '/api/v1/products',
    method: 'post',
    data
  })
}

/**
 * 更新产品
 * @param id - 产品ID
 * @param data - 更新产品请求体
 * @returns 更新后的产品
 */
export const updateProduct = (id: string, data: ProductUpdateDTO) => {
  return request<ProductDTO>({
    url: `/api/v1/products/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除产品
 * @param id - 产品ID
 */
export const deleteProduct = (id: string) => {
  return request({
    url: `/api/v1/products/${id}`,
    method: 'delete'
  })
}

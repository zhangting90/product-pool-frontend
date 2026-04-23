import request from '@/utils/request'
import type { ProductDTO, ProductCreateDTO, ProductUpdateDTO, PageResult } from '@/types/product'

/**
 * 获取产品列表（分页）
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
 * 搜索产品（分页）
 */
export const searchProducts = (params: {
  name?: string
  code?: string
  strategyTypeId?: number
  riskLevel?: string
  isActive?: boolean
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
 */
export const getProductById = (id: number) => {
  return request<ProductDTO>({
    url: `/api/v1/products/${id}`,
    method: 'get'
  })
}

/**
 * 根据策略类型ID获取产品（分页）
 */
export const getProductsByStrategyTypeId = (strategyTypeId: number, params: {
  page?: number
  size?: number
}) => {
  return request<PageResult<ProductDTO>>({
    url: `/api/v1/products/strategy-types/${strategyTypeId}`,
    method: 'get',
    params
  })
}

/**
 * 获取激活的产品（分页）
 */
export const getActiveProducts = (params: {
  page?: number
  size?: number
}) => {
  return request<PageResult<ProductDTO>>({
    url: '/api/v1/products/active',
    method: 'get',
    params
  })
}

/**
 * 创建产品
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
 */
export const updateProduct = (id: number, data: ProductUpdateDTO) => {
  return request<ProductDTO>({
    url: `/api/v1/products/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除产品
 */
export const deleteProduct = (id: number) => {
  return request({
    url: `/api/v1/products/${id}`,
    method: 'delete'
  })
}

import request from '@/utils/request'
import type { ProductPoolVO } from '@/types/product-pool'

/**
 * 获取产品池数据
 */
export const getProductPool = (activeOnly = true) => {
  return request<ProductPoolVO[]>({
    url: '/api/v1/product-pool',
    method: 'get',
    params: { activeOnly }
  })
}

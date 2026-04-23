/**
 * 产品池 API 模块
 * 提供产品池层级数据的查询接口
 */
import request from '@/utils/request'
import type { ProductPoolVO } from '@/types/product-pool'

/**
 * 获取产品池数据
 * @param activeOnly - 是否只返回激活的产品，默认为true
 * @returns 产品池层级数据列表
 */
export const getProductPool = (activeOnly = true) => {
  return request<ProductPoolVO[]>({
    url: '/api/v1/product-pool',
    method: 'get',
    params: { activeOnly }
  })
}

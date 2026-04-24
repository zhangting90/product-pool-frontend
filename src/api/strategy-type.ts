/**
 * 策略类型 API 模块
 * 提供策略类型的增删改查接口，支持按大分类、子分类、业绩对标多级筛选
 */
import request from '@/utils/request'
import type {
  StrategyTypeDTO,
  StrategyTypeCreateDTO,
  StrategyTypeUpdateDTO
} from '@/types/strategy-type'

/**
 * 获取策略类型列表，支持多级筛选
 * @param params - 筛选参数（benchmarkId/majorTypeId/subTypeId 均可选）
 * @returns 策略类型列表
 */
export const getStrategyTypes = (params?: {
  benchmarkId?: string
  majorTypeId?: string
  subTypeId?: string
}) => {
  return request<StrategyTypeDTO[]>({
    url: '/api/v1/strategy-types',
    method: 'get',
    params
  })
}

/**
 * 根据ID获取策略类型
 * @param id - 策略类型ID
 * @returns 策略类型详情
 */
export const getStrategyTypeById = (id: string) => {
  return request<StrategyTypeDTO>({
    url: `/api/v1/strategy-types/${id}`,
    method: 'get'
  })
}

/**
 * 根据业绩对标ID获取策略类型
 * @param benchmarkId - 业绩对标ID
 * @returns 策略类型列表
 */
export const getStrategyTypesByBenchmarkId = (benchmarkId: string) => {
  return request<StrategyTypeDTO[]>({
    url: `/api/v1/strategy-types/benchmarks/${benchmarkId}`,
    method: 'get'
  })
}

/**
 * 创建策略类型
 * @param data - 创建策略类型请求体
 * @returns 新创建的策略类型
 */
export const createStrategyType = (data: StrategyTypeCreateDTO) => {
  return request<StrategyTypeDTO>({
    url: '/api/v1/strategy-types',
    method: 'post',
    data
  })
}

/**
 * 更新策略类型
 * @param id - 策略类型ID
 * @param data - 更新策略类型请求体
 * @returns 更新后的策略类型
 */
export const updateStrategyType = (id: string, data: StrategyTypeUpdateDTO) => {
  return request<StrategyTypeDTO>({
    url: `/api/v1/strategy-types/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除策略类型
 * @param id - 策略类型ID
 */
export const deleteStrategyType = (id: string) => {
  return request({
    url: `/api/v1/strategy-types/${id}`,
    method: 'delete'
  })
}

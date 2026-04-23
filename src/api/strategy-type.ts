import request from '@/utils/request'
import type { StrategyTypeDTO, StrategyTypeCreateDTO, StrategyTypeUpdateDTO } from '@/types/strategy-type'

/**
 * 获取所有策略类型
 */
export const getStrategyTypes = (benchmarkId?: number) => {
  return request<StrategyTypeDTO[]>({
    url: '/api/v1/strategy-types',
    method: 'get',
    params: { benchmarkId }
  })
}

/**
 * 根据ID获取策略类型
 */
export const getStrategyTypeById = (id: number) => {
  return request<StrategyTypeDTO>({
    url: `/api/v1/strategy-types/${id}`,
    method: 'get'
  })
}

/**
 * 根据业绩对标ID获取策略类型
 */
export const getStrategyTypesByBenchmarkId = (benchmarkId: number) => {
  return request<StrategyTypeDTO[]>({
    url: `/api/v1/strategy-types/benchmarks/${benchmarkId}`,
    method: 'get'
  })
}

/**
 * 创建策略类型
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
 */
export const updateStrategyType = (id: number, data: StrategyTypeUpdateDTO) => {
  return request<StrategyTypeDTO>({
    url: `/api/v1/strategy-types/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除策略类型
 */
export const deleteStrategyType = (id: number) => {
  return request({
    url: `/api/v1/strategy-types/${id}`,
    method: 'delete'
  })
}

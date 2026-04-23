/**
 * 业绩对标 API 模块
 * 提供业绩对标的增删改查接口，支持按配置类型筛选
 */
import request from '@/utils/request'
import type { BenchmarkDTO, BenchmarkCreateDTO, BenchmarkUpdateDTO } from '@/types/benchmark'

/**
 * 获取所有业绩对标
 * @param configurationTypeId - 可选，按配置类型ID筛选
 * @returns 业绩对标列表
 */
export const getBenchmarks = (configurationTypeId?: number) => {
  return request<BenchmarkDTO[]>({
    url: '/api/v1/benchmarks',
    method: 'get',
    params: { configurationTypeId }
  })
}

/**
 * 根据ID获取业绩对标
 * @param id - 业绩对标ID
 * @returns 业绩对标详情
 */
export const getBenchmarkById = (id: number) => {
  return request<BenchmarkDTO>({
    url: `/api/v1/benchmarks/${id}`,
    method: 'get'
  })
}

/**
 * 根据配置类型ID获取业绩对标
 * @param configurationTypeId - 配置类型ID
 * @returns 业绩对标列表
 */
export const getBenchmarksByConfigurationTypeId = (configurationTypeId: number) => {
  return request<BenchmarkDTO[]>({
    url: `/api/v1/benchmarks/configuration-types/${configurationTypeId}`,
    method: 'get'
  })
}

/**
 * 创建业绩对标
 * @param data - 创建业绩对标请求体
 * @returns 新创建的业绩对标
 */
export const createBenchmark = (data: BenchmarkCreateDTO) => {
  return request<BenchmarkDTO>({
    url: '/api/v1/benchmarks',
    method: 'post',
    data
  })
}

/**
 * 更新业绩对标
 * @param id - 业绩对标ID
 * @param data - 更新业绩对标请求体
 * @returns 更新后的业绩对标
 */
export const updateBenchmark = (id: number, data: BenchmarkUpdateDTO) => {
  return request<BenchmarkDTO>({
    url: `/api/v1/benchmarks/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除业绩对标
 * @param id - 业绩对标ID
 */
export const deleteBenchmark = (id: number) => {
  return request({
    url: `/api/v1/benchmarks/${id}`,
    method: 'delete'
  })
}

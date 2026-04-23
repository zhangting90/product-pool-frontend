import request from '@/utils/request'
import type { BenchmarkDTO, BenchmarkCreateDTO, BenchmarkUpdateDTO } from '@/types/benchmark'

/**
 * 获取所有业绩对标
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
 */
export const getBenchmarkById = (id: number) => {
  return request<BenchmarkDTO>({
    url: `/api/v1/benchmarks/${id}`,
    method: 'get'
  })
}

/**
 * 根据配置类型ID获取业绩对标
 */
export const getBenchmarksByConfigurationTypeId = (configurationTypeId: number) => {
  return request<BenchmarkDTO[]>({
    url: `/api/v1/benchmarks/configuration-types/${configurationTypeId}`,
    method: 'get'
  })
}

/**
 * 创建业绩对标
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
 */
export const deleteBenchmark = (id: number) => {
  return request({
    url: `/api/v1/benchmarks/${id}`,
    method: 'delete'
  })
}

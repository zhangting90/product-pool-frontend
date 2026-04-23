/**
 * 业绩对标 Pinia Store
 * 管理业绩对标的全局状态，提供加载、创建、更新、删除等操作
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { BenchmarkDTO, BenchmarkCreateDTO, BenchmarkUpdateDTO } from '@/types/benchmark'
import * as benchmarkApi from '@/api/benchmark'

export const useBenchmarkStore = defineStore('benchmark', () => {
  /** 业绩对标列表 */
  const benchmarks = ref<BenchmarkDTO[]>([])
  /** 加载状态 */
  const loading = ref(false)
  /** 错误信息 */
  const error = ref<string | null>(null)

  /**
   * 加载所有业绩对标
   * @param configurationTypeId - 可选，按配置类型ID筛选
   */
  const loadBenchmarks = async (configurationTypeId?: number) => {
    loading.value = true
    error.value = null
    try {
      benchmarks.value = await benchmarkApi.getBenchmarks(configurationTypeId)
    } catch (err: any) {
      error.value = err.message || '加载业绩对标失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 根据配置类型ID加载业绩对标
   * @param configurationTypeId - 配置类型ID
   */
  const loadByConfigurationTypeId = async (configurationTypeId: number) => {
    loading.value = true
    error.value = null
    try {
      benchmarks.value = await benchmarkApi.getBenchmarksByConfigurationTypeId(configurationTypeId)
    } catch (err: any) {
      error.value = err.message || '加载业绩对标失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 根据ID获取业绩对标
   * @param id - 业绩对标ID
   * @returns 业绩对标详情
   */
  const getById = async (id: number) => {
    try {
      return await benchmarkApi.getBenchmarkById(id)
    } catch (err: any) {
      error.value = err.message || '获取业绩对标失败'
      throw err
    }
  }

  /**
   * 创建业绩对标
   * @param data - 创建业绩对标请求体
   * @returns 新创建的业绩对标
   */
  const create = async (data: BenchmarkCreateDTO) => {
    try {
      const result = await benchmarkApi.createBenchmark(data)
      benchmarks.value.push(result)
      return result
    } catch (err: any) {
      error.value = err.message || '创建业绩对标失败'
      throw err
    }
  }

  /**
   * 更新业绩对标
   * @param id - 业绩对标ID
   * @param data - 更新业绩对标请求体
   * @returns 更新后的业绩对标
   */
  const update = async (id: number, data: BenchmarkUpdateDTO) => {
    try {
      const result = await benchmarkApi.updateBenchmark(id, data)
      const index = benchmarks.value.findIndex((b) => b.id === id)
      if (index !== -1) {
        benchmarks.value[index] = result
      }
      return result
    } catch (err: any) {
      error.value = err.message || '更新业绩对标失败'
      throw err
    }
  }

  /**
   * 删除业绩对标
   * @param id - 业绩对标ID
   */
  const remove = async (id: number) => {
    try {
      await benchmarkApi.deleteBenchmark(id)
      benchmarks.value = benchmarks.value.filter((b) => b.id !== id)
    } catch (err: any) {
      error.value = err.message || '删除业绩对标失败'
      throw err
    }
  }

  return {
    benchmarks,
    loading,
    error,
    loadBenchmarks,
    loadByConfigurationTypeId,
    getById,
    create,
    update,
    remove
  }
})

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { BenchmarkDTO, BenchmarkCreateDTO, BenchmarkUpdateDTO } from '@/types/benchmark'
import * as benchmarkApi from '@/api/benchmark'

export const useBenchmarkStore = defineStore('benchmark', () => {
  const benchmarks = ref<BenchmarkDTO[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * 加载所有业绩对标
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
   */
  const loadByConfigurationTypeId = async (configurationTypeId: number) => {
    loading.value = true
    error.value = null
    try {
      benchmarks.value = await benchmarkApi.getBenchmarksByConfigurationTypeId(
        configurationTypeId
      )
    } catch (err: any) {
      error.value = err.message || '加载业绩对标失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 根据ID获取业绩对标
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
   */
  const update = async (id: number, data: BenchmarkUpdateDTO) => {
    try {
      const result = await benchmarkApi.updateBenchmark(id, data)
      const index = benchmarks.value.findIndex(b => b.id === id)
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
   */
  const remove = async (id: number) => {
    try {
      await benchmarkApi.deleteBenchmark(id)
      benchmarks.value = benchmarks.value.filter(b => b.id !== id)
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

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { StrategyTypeDTO, StrategyTypeCreateDTO, StrategyTypeUpdateDTO } from '@/types/strategy-type'
import * as strategyTypeApi from '@/api/strategy-type'

export const useStrategyTypeStore = defineStore('strategyType', () => {
  const strategyTypes = ref<StrategyTypeDTO[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * 加载所有策略类型
   */
  const loadStrategyTypes = async (benchmarkId?: number) => {
    loading.value = true
    error.value = null
    try {
      strategyTypes.value = await strategyTypeApi.getStrategyTypes(benchmarkId)
    } catch (err: any) {
      error.value = err.message || '加载策略类型失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 根据业绩对标ID加载策略类型
   */
  const loadByBenchmarkId = async (benchmarkId: number) => {
    loading.value = true
    error.value = null
    try {
      strategyTypes.value = await strategyTypeApi.getStrategyTypesByBenchmarkId(
        benchmarkId
      )
    } catch (err: any) {
      error.value = err.message || '加载策略类型失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 根据ID获取策略类型
   */
  const getById = async (id: number) => {
    try {
      return await strategyTypeApi.getStrategyTypeById(id)
    } catch (err: any) {
      error.value = err.message || '获取策略类型失败'
      throw err
    }
  }

  /**
   * 创建策略类型
   */
  const create = async (data: StrategyTypeCreateDTO) => {
    try {
      const result = await strategyTypeApi.createStrategyType(data)
      strategyTypes.value.push(result)
      return result
    } catch (err: any) {
      error.value = err.message || '创建策略类型失败'
      throw err
    }
  }

  /**
   * 更新策略类型
   */
  const update = async (id: number, data: StrategyTypeUpdateDTO) => {
    try {
      const result = await strategyTypeApi.updateStrategyType(id, data)
      const index = strategyTypes.value.findIndex(st => st.id === id)
      if (index !== -1) {
        strategyTypes.value[index] = result
      }
      return result
    } catch (err: any) {
      error.value = err.message || '更新策略类型失败'
      throw err
    }
  }

  /**
   * 删除策略类型
   */
  const remove = async (id: number) => {
    try {
      await strategyTypeApi.deleteStrategyType(id)
      strategyTypes.value = strategyTypes.value.filter(st => st.id !== id)
    } catch (err: any) {
      error.value = err.message || '删除策略类型失败'
      throw err
    }
  }

  return {
    strategyTypes,
    loading,
    error,
    loadStrategyTypes,
    loadByBenchmarkId,
    getById,
    create,
    update,
    remove
  }
})

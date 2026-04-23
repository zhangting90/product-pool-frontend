/**
 * 策略类型 Pinia Store
 * 管理策略类型的全局状态，提供加载、创建、更新、删除等操作
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { StrategyTypeDTO, StrategyTypeCreateDTO, StrategyTypeUpdateDTO } from '@/types/strategy-type'
import * as strategyTypeApi from '@/api/strategy-type'

export const useStrategyTypeStore = defineStore('strategyType', () => {
  /** 策略类型列表 */
  const strategyTypes = ref<StrategyTypeDTO[]>([])
  /** 加载状态 */
  const loading = ref(false)
  /** 错误信息 */
  const error = ref<string | null>(null)

  /**
   * 加载所有策略类型
   * @param benchmarkId - 可选，按业绩对标ID筛选
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
   * @param benchmarkId - 业绩对标ID
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
   * @param id - 策略类型ID
   * @returns 策略类型详情
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
   * @param data - 创建策略类型请求体
   * @returns 新创建的策略类型
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
   * @param id - 策略类型ID
   * @param data - 更新策略类型请求体
   * @returns 更新后的策略类型
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
   * @param id - 策略类型ID
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

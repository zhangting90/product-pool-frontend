/**
 * 配置类型 Pinia Store
 * 管理配置类型的全局状态，提供加载、创建、更新、删除等操作
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  ConfigurationTypeDTO,
  ConfigurationTypeCreateDTO,
  ConfigurationTypeUpdateDTO
} from '@/types/configuration-type'
import * as configurationTypeApi from '@/api/configuration-type'

export const useConfigurationTypeStore = defineStore('configurationType', () => {
  /** 配置类型列表 */
  const configurationTypes = ref<ConfigurationTypeDTO[]>([])
  /** 加载状态 */
  const loading = ref(false)
  /** 错误信息 */
  const error = ref<string | null>(null)

  /** 计算属性：大分类列表 */
  const majorTypes = computed(() => configurationTypes.value.filter((ct) => ct.isMajor))

  /** 计算属性：子分类列表 */
  const subTypes = computed(() => configurationTypes.value.filter((ct) => !ct.isMajor))

  /**
   * 加载所有配置类型
   */
  const loadConfigurationTypes = async () => {
    loading.value = true
    error.value = null
    try {
      configurationTypes.value = await configurationTypeApi.getConfigurationTypes()
    } catch (err: any) {
      error.value = err.message || '加载配置类型失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 加载层级结构
   */
  const loadHierarchy = async () => {
    loading.value = true
    error.value = null
    try {
      configurationTypes.value = await configurationTypeApi.getConfigurationTypeHierarchy()
    } catch (err: any) {
      error.value = err.message || '加载层级结构失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 加载大分类
   */
  const loadMajorTypes = async () => {
    loading.value = true
    error.value = null
    try {
      const types = await configurationTypeApi.getMajorConfigurationTypes()
      configurationTypes.value = types
    } catch (err: any) {
      error.value = err.message || '加载大分类失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 根据ID获取配置类型
   * @param id - 配置类型ID
   * @returns 配置类型详情
   */
  const getById = async (id: number) => {
    try {
      return await configurationTypeApi.getConfigurationTypeById(id)
    } catch (err: any) {
      error.value = err.message || '获取配置类型失败'
      throw err
    }
  }

  /**
   * 根据父分类ID获取子分类
   * @param parentId - 父分类ID
   * @returns 子分类列表
   */
  const getByParentId = async (parentId: number) => {
    try {
      return await configurationTypeApi.getConfigurationTypesByParentId(parentId)
    } catch (err: any) {
      error.value = err.message || '获取子分类失败'
      throw err
    }
  }

  /**
   * 创建配置类型
   * @param data - 创建配置类型请求体
   * @returns 新创建的配置类型
   */
  const create = async (data: ConfigurationTypeCreateDTO) => {
    try {
      const result = await configurationTypeApi.createConfigurationType(data)
      configurationTypes.value.push(result)
      return result
    } catch (err: any) {
      error.value = err.message || '创建配置类型失败'
      throw err
    }
  }

  /**
   * 更新配置类型
   * @param id - 配置类型ID
   * @param data - 更新配置类型请求体
   * @returns 更新后的配置类型
   */
  const update = async (id: number, data: ConfigurationTypeUpdateDTO) => {
    try {
      const result = await configurationTypeApi.updateConfigurationType(id, data)
      const index = configurationTypes.value.findIndex((ct) => ct.id === id)
      if (index !== -1) {
        configurationTypes.value[index] = result
      }
      return result
    } catch (err: any) {
      error.value = err.message || '更新配置类型失败'
      throw err
    }
  }

  /**
   * 删除配置类型
   * @param id - 配置类型ID
   */
  const remove = async (id: number) => {
    try {
      await configurationTypeApi.deleteConfigurationType(id)
      configurationTypes.value = configurationTypes.value.filter((ct) => ct.id !== id)
    } catch (err: any) {
      error.value = err.message || '删除配置类型失败'
      throw err
    }
  }

  return {
    configurationTypes,
    loading,
    error,
    majorTypes,
    subTypes,
    loadConfigurationTypes,
    loadHierarchy,
    loadMajorTypes,
    getById,
    getByParentId,
    create,
    update,
    remove
  }
})

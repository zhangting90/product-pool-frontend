import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ConfigurationTypeDTO, ConfigurationTypeCreateDTO, ConfigurationTypeUpdateDTO } from '@/types/configuration-type'
import * as configurationTypeApi from '@/api/configuration-type'

export const useConfigurationTypeStore = defineStore('configurationType', () => {
  const configurationTypes = ref<ConfigurationTypeDTO[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 计算属性：大分类
  const majorTypes = computed(() =>
    configurationTypes.value.filter(ct => ct.isMajor)
  )

  // 计算属性：子分类
  const subTypes = computed(() =>
    configurationTypes.value.filter(ct => !ct.isMajor)
  )

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
   */
  const update = async (id: number, data: ConfigurationTypeUpdateDTO) => {
    try {
      const result = await configurationTypeApi.updateConfigurationType(id, data)
      const index = configurationTypes.value.findIndex(ct => ct.id === id)
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
   */
  const remove = async (id: number) => {
    try {
      await configurationTypeApi.deleteConfigurationType(id)
      configurationTypes.value = configurationTypes.value.filter(ct => ct.id !== id)
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

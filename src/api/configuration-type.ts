import request from '@/utils/request'
import type { ConfigurationTypeDTO, ConfigurationTypeCreateDTO, ConfigurationTypeUpdateDTO } from '@/types/configuration-type'

/**
 * 获取所有配置类型
 */
export const getConfigurationTypes = () => {
  return request<ConfigurationTypeDTO[]>({
    url: '/api/v1/configuration-types',
    method: 'get'
  })
}

/**
 * 根据ID获取配置类型
 */
export const getConfigurationTypeById = (id: number) => {
  return request<ConfigurationTypeDTO>({
    url: `/api/v1/configuration-types/${id}`,
    method: 'get'
  })
}

/**
 * 根据父分类ID获取子分类
 */
export const getConfigurationTypesByParentId = (parentId: number) => {
  return request<ConfigurationTypeDTO[]>({
    url: `/api/v1/configuration-types/${parentId}/children`,
    method: 'get'
  })
}

/**
 * 获取大分类及其子分类（层级结构）
 */
export const getConfigurationTypeHierarchy = () => {
  return request<ConfigurationTypeDTO[]>({
    url: '/api/v1/configuration-types/hierarchy',
    method: 'get'
  })
}

/**
 * 获取所有大分类
 */
export const getMajorConfigurationTypes = () => {
  return request<ConfigurationTypeDTO[]>({
    url: '/api/v1/configuration-types/major',
    method: 'get'
  })
}

/**
 * 创建配置类型
 */
export const createConfigurationType = (data: ConfigurationTypeCreateDTO) => {
  return request<ConfigurationTypeDTO>({
    url: '/api/v1/configuration-types',
    method: 'post',
    data
  })
}

/**
 * 更新配置类型
 */
export const updateConfigurationType = (id: number, data: ConfigurationTypeUpdateDTO) => {
  return request<ConfigurationTypeDTO>({
    url: `/api/v1/configuration-types/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除配置类型
 */
export const deleteConfigurationType = (id: number) => {
  return request({
    url: `/api/v1/configuration-types/${id}`,
    method: 'delete'
  })
}

/**
 * 配置类型 API 模块
 * 提供配置类型的增删改查接口，包括层级结构和大分类/子分类查询
 */
import request from '@/utils/request'
import type { ConfigurationTypeDTO, ConfigurationTypeCreateDTO, ConfigurationTypeUpdateDTO } from '@/types/configuration-type'

/**
 * 获取所有配置类型
 * @returns 配置类型列表
 */
export const getConfigurationTypes = () => {
  return request<ConfigurationTypeDTO[]>({
    url: '/api/v1/configuration-types',
    method: 'get'
  })
}

/**
 * 根据ID获取配置类型
 * @param id - 配置类型ID
 * @returns 配置类型详情
 */
export const getConfigurationTypeById = (id: number) => {
  return request<ConfigurationTypeDTO>({
    url: `/api/v1/configuration-types/${id}`,
    method: 'get'
  })
}

/**
 * 根据父分类ID获取子分类
 * @param parentId - 父分类ID
 * @returns 子分类列表
 */
export const getConfigurationTypesByParentId = (parentId: number) => {
  return request<ConfigurationTypeDTO[]>({
    url: `/api/v1/configuration-types/${parentId}/children`,
    method: 'get'
  })
}

/**
 * 获取大分类及其子分类（层级结构）
 * @returns 层级树形结构的配置类型列表
 */
export const getConfigurationTypeHierarchy = () => {
  return request<ConfigurationTypeDTO[]>({
    url: '/api/v1/configuration-types/hierarchy',
    method: 'get'
  })
}

/**
 * 获取所有大分类
 * @returns 大分类列表
 */
export const getMajorConfigurationTypes = () => {
  return request<ConfigurationTypeDTO[]>({
    url: '/api/v1/configuration-types/major',
    method: 'get'
  })
}

/**
 * 创建配置类型
 * @param data - 创建配置类型请求体
 * @returns 新创建的配置类型
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
 * @param id - 配置类型ID
 * @param data - 更新配置类型请求体
 * @returns 更新后的配置类型
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
 * @param id - 配置类型ID
 */
export const deleteConfigurationType = (id: number) => {
  return request({
    url: `/api/v1/configuration-types/${id}`,
    method: 'delete'
  })
}

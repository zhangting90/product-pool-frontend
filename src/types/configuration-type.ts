/**
 * 配置类型相关类型定义
 * 包含配置类型的DTO、创建DTO、更新DTO，以及关联的业绩对标DTO
 */
export interface ConfigurationTypeDTO {
  /** 主键ID */
  id: string
  /** 配置类型名称（唯一） */
  name: string
  /** 配置类型描述 */
  description?: string
  /** 是否为大分类 */
  isMajor: boolean
  /** 父分类ID */
  parentId?: string
  /** 排序序号 */
  sortOrder?: number
  /** 创建时间 */
  createdAt?: string
  /** 更新时间 */
  updatedAt?: string
  /** 子分类列表 */
  children?: ConfigurationTypeDTO[]
  /** 关联的业绩对标列表 */
  benchmarks?: BenchmarkDTO[]
}

/**
 * 创建配置类型请求体
 */
export interface ConfigurationTypeCreateDTO {
  /** 配置类型名称（唯一） */
  name: string
  /** 配置类型描述 */
  description?: string
  /** 是否为大分类 */
  isMajor: boolean
  /** 父分类ID */
  parentId?: string
  /** 排序序号 */
  sortOrder?: number
}

/**
 * 更新配置类型请求体
 */
export interface ConfigurationTypeUpdateDTO {
  /** 配置类型名称 */
  name: string
  /** 配置类型描述 */
  description?: string
  /** 排序序号 */
  sortOrder?: number
}

/**
 * 业绩对标数据传输对象
 */
export interface BenchmarkDTO {
  /** 主键ID */
  id: string
  /** 业绩对标名称 */
  name: string
  /** 业绩对标编码 */
  code: string
  /** 业绩对标描述 */
  description?: string
  /** 所属配置类型ID */
  configurationTypeId: string
  /** 所属配置类型名称 */
  configurationTypeName?: string
  /** 排序序号 */
  sortOrder?: number
  /** 创建时间 */
  createdAt?: string
  /** 更新时间 */
  updatedAt?: string
  /** 关联的策略类型列表 */
  strategyTypes?: StrategyTypeDTO[]
}

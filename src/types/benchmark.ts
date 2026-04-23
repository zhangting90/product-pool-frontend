/**
 * 业绩对标相关类型定义
 * 包含业绩对标DTO、创建DTO、更新DTO，以及关联的策略类型DTO
 */
export interface BenchmarkDTO {
  /** 主键ID */
  id: number
  /** 业绩对标名称 */
  name: string
  /** 业绩对标编码 */
  code: string
  /** 业绩对标描述 */
  description?: string
  /** 所属配置类型ID */
  configurationTypeId: number
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

/**
 * 创建业绩对标请求体
 */
export interface BenchmarkCreateDTO {
  /** 业绩对标名称 */
  name: string
  /** 业绩对标编码 */
  code: string
  /** 业绩对标描述 */
  description?: string
  /** 所属配置类型ID */
  configurationTypeId: number
  /** 排序序号 */
  sortOrder?: number
}

/**
 * 更新业绩对标请求体
 */
export interface BenchmarkUpdateDTO {
  /** 业绩对标名称 */
  name: string
  /** 业绩对标描述 */
  description?: string
  /** 排序序号 */
  sortOrder?: number
}

/**
 * 策略类型数据传输对象
 */
export interface StrategyTypeDTO {
  /** 主键ID */
  id: number
  /** 策略类型名称 */
  name: string
  /** 策略类型描述 */
  description?: string
  /** 所属业绩对标ID */
  benchmarkId: number
  /** 所属业绩对标名称 */
  benchmarkName?: string
  /** 排序序号 */
  sortOrder?: number
  /** 创建时间 */
  createdAt?: string
  /** 更新时间 */
  updatedAt?: string
  /** 关联的产品列表 */
  products?: ProductDTO[]
}

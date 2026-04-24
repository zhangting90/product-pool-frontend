/**
 * 产品池相关类型定义
 * 用于产品池层级结构的展示，包含配置类型、业绩对标、策略类型、产品的视图对象
 */
export interface ProductPoolVO {
  /** 配置类型ID */
  configurationTypeId: string
  /** 配置类型名称 */
  configurationTypeName: string
  /** 配置类型编码 */
  configurationTypeCode: string
  /** 是否为大分类 */
  isMajor: boolean
  /** 父分类ID */
  parentId?: string
  /** 排序序号 */
  sortOrder?: number
  /** 子分类列表 */
  children?: ConfigurationTypeVO[]
  /** 关联的业绩对标列表 */
  benchmarks?: BenchmarkVO[]
}

/**
 * 配置类型视图对象（产品池用）
 */
export interface ConfigurationTypeVO {
  /** 主键ID */
  id: string
  /** 配置类型名称 */
  name: string
  /** 配置类型编码 */
  code: string
  /** 排序序号 */
  sortOrder?: number
  /** 关联的业绩对标列表 */
  benchmarks?: BenchmarkVO[]
}

/**
 * 业绩对标视图对象（产品池用）
 */
export interface BenchmarkVO {
  /** 主键ID */
  id: string
  /** 业绩对标名称 */
  name: string
  /** 业绩对标编码 */
  code: string
  /** 排序序号 */
  sortOrder?: number
  /** 关联的策略类型列表 */
  strategyTypes?: StrategyTypeVO[]
}

/**
 * 策略类型视图对象（产品池用）
 */
export interface StrategyTypeVO {
  /** 主键ID */
  id: string
  /** 策略类型名称 */
  name: string
  /** 策略类型描述 */
  description?: string
  /** 排序序号 */
  sortOrder?: number
  /** 关联的产品列表 */
  products?: ProductDTO[]
}

/**
 * 产品数据传输对象（产品池用）
 */
export interface ProductDTO {
  /** 主键ID */
  id: string
  /** 产品名称 */
  name: string
  /** 产品编码 */
  code: string
  /** 所属策略类型ID */
  strategyTypeId: string
  /** 所属策略类型名称 */
  strategyTypeName?: string
  /** 风险等级 */
  riskLevel: string
  /** 年化收益率 */
  annualReturn?: number
  /** 波动率 */
  volatility?: number
  /** 夏普比率 */
  sharpeRatio?: number
  /** 最大回撤 */
  maxDrawdown?: number
  /** 基金经理 */
  fundManager?: string
  /** 基金规模 */
  fundScale?: number
  /** 成立日期 */
  inceptionDate?: string
  /** 产品描述 */
  description?: string
  /** 是否启用 */
  isActive: boolean
  /** 排序序号 */
  sortOrder?: number
  /** 创建时间 */
  createdAt?: string
  /** 更新时间 */
  updatedAt?: string
}

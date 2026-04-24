/**
 * 策略类型相关类型定义
 * 包含策略类型DTO、创建DTO、更新DTO，以及关联的产品DTO
 */
export interface StrategyTypeDTO {
  /** 主键ID */
  id: string
  /** 策略类型名称 */
  name: string
  /** 策略类型描述 */
  description?: string
  /** 所属业绩对标ID */
  benchmarkId: string
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

/**
 * 创建策略类型请求体
 */
export interface StrategyTypeCreateDTO {
  /** 策略类型名称 */
  name: string
  /** 策略类型描述 */
  description?: string
  /** 所属业绩对标ID */
  benchmarkId: string
  /** 排序序号 */
  sortOrder?: number
}

/**
 * 更新策略类型请求体
 */
export interface StrategyTypeUpdateDTO {
  /** 策略类型名称 */
  name: string
  /** 策略类型描述 */
  description?: string
  /** 排序序号 */
  sortOrder?: number
}

/**
 * 产品数据传输对象
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

/**
 * 产品相关类型定义
 * 包含产品DTO、创建DTO、更新DTO，以及通用分页结果类型
 */
export interface ProductDTO {
  /** 主键ID */
  id: number
  /** 产品名称 */
  name: string
  /** 产品编码 */
  code: string
  /** 所属策略类型ID */
  strategyTypeId: number
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

/**
 * 创建产品请求体
 */
export interface ProductCreateDTO {
  /** 产品名称 */
  name: string
  /** 产品编码 */
  code: string
  /** 所属策略类型ID */
  strategyTypeId: number
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
  isActive?: boolean
  /** 排序序号 */
  sortOrder?: number
}

/**
 * 更新产品请求体
 */
export interface ProductUpdateDTO {
  /** 产品名称 */
  name: string
  /** 产品描述 */
  description?: string
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
  /** 是否启用 */
  isActive?: boolean
  /** 排序序号 */
  sortOrder?: number
}

/**
 * 通用分页结果
 * @template T 数据项类型
 */
export interface PageResult<T> {
  /** 数据列表 */
  content: T[]
  /** 当前页码 */
  pageNumber: number
  /** 每页条数 */
  pageSize: number
  /** 总记录数 */
  totalElements: number
  /** 总页数 */
  totalPages: number
  /** 是否第一页 */
  first: boolean
  /** 是否最后一页 */
  last: boolean
}

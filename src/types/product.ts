export interface ProductDTO {
  id: number
  name: string
  code: string
  strategyTypeId: number
  strategyTypeName?: string
  riskLevel: string
  annualReturn?: number
  volatility?: number
  sharpeRatio?: number
  maxDrawdown?: number
  fundManager?: string
  fundScale?: number
  inceptionDate?: string
  description?: string
  isActive: boolean
  sortOrder?: number
  createdAt?: string
  updatedAt?: string
}

export interface ProductCreateDTO {
  name: string
  code: string
  strategyTypeId: number
  riskLevel: string
  annualReturn?: number
  volatility?: number
  sharpeRatio?: number
  maxDrawdown?: number
  fundManager?: string
  fundScale?: number
  inceptionDate?: string
  description?: string
  isActive?: boolean
  sortOrder?: number
}

export interface ProductUpdateDTO {
  name: string
  description?: string
  riskLevel: string
  annualReturn?: number
  volatility?: number
  sharpeRatio?: number
  maxDrawdown?: number
  fundManager?: string
  fundScale?: number
  inceptionDate?: string
  isActive?: boolean
  sortOrder?: number
}

export interface PageResult<T> {
  content: T[]
  pageNumber: number
  pageSize: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
}

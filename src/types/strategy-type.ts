export interface StrategyTypeDTO {
  id: number
  name: string
  description?: string
  benchmarkId: number
  benchmarkName?: string
  sortOrder?: number
  createdAt?: string
  updatedAt?: string
  products?: ProductDTO[]
}

export interface StrategyTypeCreateDTO {
  name: string
  description?: string
  benchmarkId: number
  sortOrder?: number
}

export interface StrategyTypeUpdateDTO {
  name: string
  description?: string
  sortOrder?: number
}

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

export interface ProductPoolVO {
  configurationTypeId: number
  configurationTypeName: string
  configurationTypeCode: string
  isMajor: boolean
  parentId?: number
  sortOrder?: number
  children?: ConfigurationTypeVO[]
  benchmarks?: BenchmarkVO[]
}

export interface ConfigurationTypeVO {
  id: number
  name: string
  code: string
  sortOrder?: number
  benchmarks?: BenchmarkVO[]
}

export interface BenchmarkVO {
  id: number
  name: string
  code: string
  sortOrder?: number
  strategyTypes?: StrategyTypeVO[]
}

export interface StrategyTypeVO {
  id: number
  name: string
  description?: string
  sortOrder?: number
  products?: ProductDTO[]
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

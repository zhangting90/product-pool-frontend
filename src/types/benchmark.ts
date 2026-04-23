export interface BenchmarkDTO {
  id: number
  name: string
  code: string
  description?: string
  configurationTypeId: number
  configurationTypeName?: string
  sortOrder?: number
  createdAt?: string
  updatedAt?: string
  strategyTypes?: StrategyTypeDTO[]
}

export interface BenchmarkCreateDTO {
  name: string
  code: string
  description?: string
  configurationTypeId: number
  sortOrder?: number
}

export interface BenchmarkUpdateDTO {
  name: string
  description?: string
  sortOrder?: number
}

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

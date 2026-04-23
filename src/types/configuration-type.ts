export interface ConfigurationTypeDTO {
  id: number
  name: string
  code: string
  description?: string
  isMajor: boolean
  parentId?: number
  sortOrder?: number
  createdAt?: string
  updatedAt?: string
  children?: ConfigurationTypeDTO[]
  benchmarks?: BenchmarkDTO[]
}

export interface ConfigurationTypeCreateDTO {
  name: string
  code: string
  description?: string
  isMajor: boolean
  parentId?: number
  sortOrder?: number
}

export interface ConfigurationTypeUpdateDTO {
  name: string
  description?: string
  sortOrder?: number
}

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

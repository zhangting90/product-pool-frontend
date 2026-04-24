<!-- 产品管理页面：分类→业绩对标→策略类型三级联动筛选，任何条件变化均触发后端查询 -->
<template>
  <div class="product-list">
    <!-- 页面头部：标题、三级筛选和操作按钮 -->
    <div class="header">
      <h2>产品管理</h2>
      <div class="header-actions">
        <!-- 分类下拉框 -->
        <el-select
          v-model="selectedConfigurationType"
          placeholder="选择分类"
          clearable
          @change="handleConfigurationTypeChange"
          style="width: 180px"
        >
          <el-option
            v-for="ct in configurationTypes"
            :key="ct.id"
            :label="ct.name"
            :value="ct.id"
          />
        </el-select>
        <!-- 业绩对标下拉框 -->
        <el-select
          v-model="selectedBenchmark"
          placeholder="选择业绩对标"
          clearable
          @change="handleBenchmarkChange"
          style="width: 180px"
          :disabled="!selectedConfigurationType"
        >
          <el-option v-for="bm in benchmarks" :key="bm.id" :label="bm.name" :value="bm.id" />
        </el-select>
        <!-- 策略类型下拉框 -->
        <el-select
          v-model="selectedStrategyType"
          placeholder="选择策略类型"
          clearable
          @change="handleStrategyTypeChange"
          style="width: 180px"
          :disabled="!selectedBenchmark"
        >
          <el-option
            v-for="st in strategyTypes"
            :key="st.id"
            :label="st.name"
            :value="st.id"
          />
        </el-select>
        <el-button type="primary" @click="handleAdd" :disabled="!selectedStrategyType">
          <el-icon><Plus /></el-icon>
          新增产品
        </el-button>
        <el-button @click="handleRefresh">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <!-- 搜索栏：产品名称、代码筛选 -->
    <div class="search-bar">
      <el-input
        v-model="searchForm.name"
        placeholder="产品名称"
        clearable
        style="width: 200px"
        @keyup.enter="handleSearch"
      />
      <el-input
        v-model="searchForm.code"
        placeholder="产品代码"
        clearable
        style="width: 200px"
        @keyup.enter="handleSearch"
      />
      <el-button type="primary" @click="handleSearch">搜索</el-button>
      <el-button @click="handleReset">重置</el-button>
    </div>

    <!-- 产品数据表格（带分页） -->
    <Table
      :data="products"
      :loading="loading"
      :pagination="true"
      :total="total"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      @sort-change="handleSortChange"
    >
      <el-table-column label="代码" prop="code" sortable="custom" width="150" />
      <el-table-column label="名称" prop="name" sortable="custom" />
      <el-table-column label="策略类型" prop="strategyTypeName" sortable="custom" />
      <el-table-column label="排序" prop="sortOrder" sortable="custom" width="100" />
      <!-- 操作列：编辑、删除、上移、下移 -->
      <el-table-column label="操作" width="240" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)"> 删除 </el-button>
          <el-button size="small" @click="handleMoveUp(row)" :disabled="!canMoveUp(row)">
            <el-icon><ArrowUp /></el-icon>
          </el-button>
          <el-button size="small" @click="handleMoveDown(row)" :disabled="!canMoveDown(row)">
            <el-icon><ArrowDown /></el-icon>
          </el-button>
        </template>
      </el-table-column>
    </Table>

    <!-- 编辑对话框 -->
    <ProductDialog
      v-model:visible="dialogVisible"
      v-model="formData"
      :title="dialogTitle"
      :is-edit="isEdit"
      @confirm="handleConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Plus, Refresh, ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import { useProductStore } from '@/stores/product'
import { useMessage } from '@/composables/useMessage'
import { useConfirm } from '@/composables/useConfirm'
import * as configurationTypeApi from '@/api/configuration-type'
import * as benchmarkApi from '@/api/benchmark'
import * as strategyTypeApi from '@/api/strategy-type'
import Table from '@/components/common/Table.vue'
import ProductDialog from './ProductDialog.vue'
import type { ProductDTO } from '@/types/product'
import type { ConfigurationTypeDTO } from '@/types/configuration-type'
import type { BenchmarkDTO } from '@/types/benchmark'
import type { StrategyTypeDTO } from '@/types/strategy-type'

// 初始化store和工具函数
const productStore = useProductStore()
const { success, error: showError } = useMessage()
const { confirmDelete } = useConfirm()

// ============ 下拉框数据源 ============
const configurationTypes = ref<ConfigurationTypeDTO[]>([])
const benchmarks = ref<BenchmarkDTO[]>([])
const strategyTypes = ref<StrategyTypeDTO[]>([])

// ============ 当前选中值 ============
const selectedConfigurationType = ref<string>()
const selectedBenchmark = ref<string>()
const selectedStrategyType = ref<string>()

// ============ 分页状态 ============
const currentPage = ref(1)
const pageSize = ref(10)

// ============ 搜索表单 ============
const searchForm = ref({
  name: '',
  code: ''
})

// ============ 对话框相关状态 ============
const dialogVisible = ref(false)
const dialogTitle = ref('')
const isEdit = ref(false)
const formData = ref<Partial<ProductDTO>>({})

// ============ 计算属性 ============
const products = computed(() => productStore.products)
const loading = computed(() => productStore.loading)
const total = computed(() => productStore.pageResult.totalElements)

// ============ 页面初始化 ============
onMounted(async () => {
  try {
    const [majorTypes] = await Promise.all([
      configurationTypeApi.getMajorConfigurationTypes()
    ])
    configurationTypes.value = majorTypes
    searchProducts()
  } catch (err: any) {
    showError(err.message || '加载数据失败')
  }
})

// ============ 分类变化：加载该分类下的业绩对标，清空后续选择，刷新产品列表 ============
const handleConfigurationTypeChange = async () => {
  selectedBenchmark.value = undefined
  selectedStrategyType.value = undefined
  benchmarks.value = []
  strategyTypes.value = []
  currentPage.value = 1
  try {
    if (selectedConfigurationType.value) {
      benchmarks.value = await benchmarkApi.getBenchmarksByConfigurationTypeId(
        selectedConfigurationType.value
      )
    }
    searchProducts()
  } catch (err: any) {
    showError(err.message || '加载业绩对标失败')
  }
}

// ============ 业绩对标变化：加载该业绩对标下的策略类型，清空后续选择，刷新产品列表 ============
const handleBenchmarkChange = async () => {
  selectedStrategyType.value = undefined
  strategyTypes.value = []
  currentPage.value = 1
  try {
    if (selectedBenchmark.value) {
      strategyTypes.value = await strategyTypeApi.getStrategyTypesByBenchmarkId(
        selectedBenchmark.value
      )
    }
    searchProducts()
  } catch (err: any) {
    showError(err.message || '加载策略类型失败')
  }
}

// ============ 策略类型变化：刷新产品列表 ============
const handleStrategyTypeChange = () => {
  currentPage.value = 1
  searchProducts()
}

// ============ 统一搜索产品：携带所有筛选条件查询后端 ============
const searchProducts = async () => {
  try {
    const params: Record<string, any> = {
      name: searchForm.value.name || undefined,
      code: searchForm.value.code || undefined,
      page: currentPage.value - 1,
      size: pageSize.value
    }
    if (selectedConfigurationType.value) {
      params.configurationTypeId = selectedConfigurationType.value
    }
    if (selectedBenchmark.value) {
      params.benchmarkId = selectedBenchmark.value
    }
    if (selectedStrategyType.value) {
      params.strategyTypeId = selectedStrategyType.value
    }
    await productStore.searchProducts(params)
  } catch (err: any) {
    showError(err.message || '搜索产品失败')
  }
}

// ============ 搜索/重置 ============
const handleSearch = () => {
  currentPage.value = 1
  searchProducts()
}

const handleReset = () => {
  searchForm.value = { name: '', code: '' }
  currentPage.value = 1
  searchProducts()
}

// ============ 刷新数据 ============
const handleRefresh = () => {
  searchProducts()
}

// ============ 新增产品（需要选择策略类型） ============
const handleAdd = () => {
  if (!selectedStrategyType.value) {
    showError('请先选择策略类型')
    return
  }
  isEdit.value = false
  dialogTitle.value = '新增产品'
  formData.value = {
    strategyTypeId: selectedStrategyType.value,
    sortOrder: 0
  }
  dialogVisible.value = true
}

// ============ 编辑产品 ============
const handleEdit = (data: ProductDTO) => {
  isEdit.value = true
  dialogTitle.value = '编辑产品'
  formData.value = { ...data }
  dialogVisible.value = true
}

// ============ 删除产品 ============
const handleDelete = async (data: ProductDTO) => {
  if (await confirmDelete(`确定要删除 "${data.name}" 吗？`)) {
    try {
      await productStore.remove(data.id)
      await handleRefresh()
      success('删除成功')
    } catch (err: any) {
      showError(err.message || '删除失败')
    }
  }
}

// ============ 对话框确认提交 ============
const handleConfirm = async () => {
  try {
    if (isEdit.value) {
      await productStore.update(formData.value.id!, {
        name: formData.value.name!,
        description: formData.value.description,
        sortOrder: formData.value.sortOrder
      })
    } else {
      await productStore.create({
        name: formData.value.name!,
        code: formData.value.code!,
        strategyTypeId: formData.value.strategyTypeId!,
        description: formData.value.description,
        sortOrder: formData.value.sortOrder || 0
      })
    }
    dialogVisible.value = false
    handleRefresh()
    success(isEdit.value ? '更新成功' : '创建成功')
  } catch (err: any) {
    showError(err.message || isEdit.value ? '更新失败' : '创建失败')
  }
}

// ============ 排序变化处理 ============
const handleSortChange = () => {
  // 排序变化处理
}

// ============ 上下移动 ============
const canMoveUp = (data: ProductDTO) => {
  const index = products.value.findIndex((p) => p.id === data.id)
  return index > 0
}

const canMoveDown = (data: ProductDTO) => {
  const index = products.value.findIndex((p) => p.id === data.id)
  return index < products.value.length - 1
}

const handleMoveUp = async (data: ProductDTO) => {
  if (canMoveUp(data)) {
    try {
      await productStore.update(data.id, {
        name: data.name,
        sortOrder: (data.sortOrder || 0) - 1
      })
      await handleRefresh()
      success('排序更新成功')
    } catch (err: any) {
      showError(err.message || '排序更新失败')
    }
  }
}

const handleMoveDown = async (data: ProductDTO) => {
  if (canMoveDown(data)) {
    try {
      await productStore.update(data.id, {
        name: data.name,
        sortOrder: (data.sortOrder || 0) + 1
      })
      await handleRefresh()
      success('排序更新成功')
    } catch (err: any) {
      showError(err.message || '排序更新失败')
    }
  }
}
</script>

<style scoped>
.product-list {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
</style>

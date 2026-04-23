<!-- 产品管理页面：按策略类型筛选，支持搜索、分页，表格展示产品列表 -->
<template>
  <div class="product-list">
    <!-- 页面头部：标题、策略类型筛选和操作按钮 -->
    <div class="header">
      <h2>产品管理</h2>
      <div class="header-actions">
        <!-- 策略类型筛选下拉框 -->
        <el-select
          v-model="selectedStrategyType"
          placeholder="选择策略类型"
          clearable
          @change="handleStrategyTypeChange"
          style="width: 200px"
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

    <!-- 搜索栏：产品名称、代码、风险等级、状态筛选 -->
    <div class="search-bar">
      <el-input
        v-model="searchForm.name"
        placeholder="产品名称"
        clearable
        style="width: 200px"
        @change="handleSearch"
      />
      <el-input
        v-model="searchForm.code"
        placeholder="产品代码"
        clearable
        style="width: 200px"
        @change="handleSearch"
      />
      <el-select
        v-model="searchForm.riskLevel"
        placeholder="风险等级"
        clearable
        style="width: 150px"
        @change="handleSearch"
      >
        <el-option label="低风险" value="低风险" />
        <el-option label="中低风险" value="中低风险" />
        <el-option label="中等风险" value="中等风险" />
        <el-option label="中高风险" value="中高风险" />
        <el-option label="高风险" value="高风险" />
      </el-select>
      <el-select
        v-model="searchForm.isActive"
        placeholder="状态"
        clearable
        style="width: 120px"
        @change="handleSearch"
      >
        <el-option label="激活" :value="true" />
        <el-option label="停用" :value="false" />
      </el-select>
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
      <el-table-column label="名称" prop="name" sortable="custom" />
      <el-table-column label="代码" prop="code" sortable="custom" width="150" />
      <el-table-column label="策略类型" prop="strategyTypeName" sortable="custom" />
      <!-- 风险等级列，使用标签展示 -->
      <el-table-column label="风险等级" prop="riskLevel" sortable="custom" width="120">
        <template #default="{ row }">
          <el-tag :type="getRiskTagType(row.riskLevel)">
            {{ row.riskLevel }}
          </el-tag>
        </template>
      </el-table-column>
      <!-- 年化收益率列，格式化为百分比 -->
      <el-table-column label="年化收益率" prop="annualReturn" sortable="custom" width="120">
        <template #default="{ row }">
          {{ formatPercent(row.annualReturn) }}
        </template>
      </el-table-column>
      <!-- 波动率列，格式化为百分比 -->
      <el-table-column label="波动率" prop="volatility" sortable="custom" width="120">
        <template #default="{ row }">
          {{ formatPercent(row.volatility) }}
        </template>
      </el-table-column>
      <el-table-column label="夏普比率" prop="sharpeRatio" sortable="custom" width="120" />
      <!-- 最大回撤列，格式化为百分比 -->
      <el-table-column label="最大回撤" prop="maxDrawdown" sortable="custom" width="120">
        <template #default="{ row }">
          {{ formatPercent(row.maxDrawdown) }}
        </template>
      </el-table-column>
      <el-table-column label="基金经理" prop="fundManager" width="120" />
      <!-- 状态列，使用标签展示激活/停用 -->
      <el-table-column label="状态" prop="isActive" sortable="custom" width="100">
        <template #default="{ row }">
          <el-tag :type="row.isActive ? 'success' : 'info'">
            {{ row.isActive ? '激活' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="sortOrder" sortable="custom" width="100" />
      <!-- 操作列：编辑、删除、上移、下移 -->
      <el-table-column label="操作" width="280" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(row)"
          >
            删除
          </el-button>
          <el-button
            size="small"
            @click="handleMoveUp(row)"
            :disabled="!canMoveUp(row)"
          >
            <el-icon><ArrowUp /></el-icon>
          </el-button>
          <el-button
            size="small"
            @click="handleMoveDown(row)"
            :disabled="!canMoveDown(row)"
          >
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
import { useStrategyTypeStore } from '@/stores/strategy-type'
import { useProductStore } from '@/stores/product'
import { useMessage } from '@/composables/useMessage'
import { useConfirm } from '@/composables/useConfirm'
import Table from '@/components/common/Table.vue'
import ProductDialog from './ProductDialog.vue'
import type { ProductDTO } from '@/types/product'

// 初始化store和工具函数
const strategyTypeStore = useStrategyTypeStore()
const productStore = useProductStore()
const { success, error: showError } = useMessage()
const { confirmDelete } = useConfirm()

// 计算属性：策略类型列表、产品列表、加载状态、总数
const strategyTypes = computed(() => strategyTypeStore.strategyTypes)
const products = computed(() => productStore.products)
const loading = computed(() => productStore.loading)
const total = computed(() => productStore.pageResult.totalElements)

// 当前选中的策略类型ID
const selectedStrategyType = ref<number>()
// 分页状态
const currentPage = ref(1)
const pageSize = ref(10)
// 搜索表单
const searchForm = ref({
  name: '',
  code: '',
  riskLevel: '',
  isActive: undefined as boolean | undefined,
})
// 对话框相关状态
const dialogVisible = ref(false)
const dialogTitle = ref('')
const isEdit = ref(false)
const formData = ref<Partial<ProductDTO>>({})

// 页面挂载时加载策略类型数据
onMounted(() => {
  loadStrategyTypes()
})

// 加载策略类型列表
const loadStrategyTypes = async () => {
  try {
    await strategyTypeStore.loadStrategyTypes()
  } catch (err: any) {
    showError(err.message || '加载策略类型失败')
  }
}

// 策略类型筛选变化处理
const handleStrategyTypeChange = () => {
  if (selectedStrategyType.value) {
    loadProducts()
  } else {
    searchProducts()
  }
}

// 按策略类型加载产品列表
const loadProducts = async () => {
  if (!selectedStrategyType.value) return
  try {
    await productStore.loadByStrategyTypeId(selectedStrategyType.value, {
      page: currentPage.value - 1,
      size: pageSize.value,
    })
  } catch (err: any) {
    showError(err.message || '加载产品失败')
  }
}

// 按条件搜索产品
const searchProducts = async () => {
  try {
    await productStore.searchProducts({
      ...searchForm.value,
      page: currentPage.value - 1,
      size: pageSize.value,
    })
  } catch (err: any) {
    showError(err.message || '搜索产品失败')
  }
}

// 搜索处理（重置到第一页）
const handleSearch = () => {
  currentPage.value = 1
  searchProducts()
}

// 重置搜索条件
const handleReset = () => {
  searchForm.value = {
    name: '',
    code: '',
    riskLevel: '',
    isActive: undefined,
  }
  currentPage.value = 1
  searchProducts()
}

// 刷新数据
const handleRefresh = () => {
  if (selectedStrategyType.value) {
    loadProducts()
  } else {
    searchProducts()
  }
}

// 新增产品
const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '新增产品'
  formData.value = {
    strategyTypeId: selectedStrategyType.value!,
    riskLevel: '中等风险',
    isActive: true,
    sortOrder: 0,
  }
  dialogVisible.value = true
}

// 编辑产品
const handleEdit = (data: ProductDTO) => {
  isEdit.value = true
  dialogTitle.value = '编辑产品'
  formData.value = { ...data }
  dialogVisible.value = true
}

// 删除产品（需确认）
const handleDelete = async (data: ProductDTO) => {
  if (await confirmDelete(`确定要删除 "${data.name}" 吗？`)) {
    try {
      await productStore.remove(data.id)
      success('删除成功')
    } catch (err: any) {
      showError(err.message || '删除失败')
    }
  }
}

// 对话框确认提交（新增或编辑）
const handleConfirm = async () => {
  try {
    if (isEdit.value) {
      await productStore.update(formData.value.id!, {
        name: formData.value.name!,
        description: formData.value.description,
        riskLevel: formData.value.riskLevel!,
        annualReturn: formData.value.annualReturn,
        volatility: formData.value.volatility,
        sharpeRatio: formData.value.sharpeRatio,
        maxDrawdown: formData.value.maxDrawdown,
        fundManager: formData.value.fundManager,
        fundScale: formData.value.fundScale,
        inceptionDate: formData.value.inceptionDate,
        isActive: formData.value.isActive,
        sortOrder: formData.value.sortOrder,
      })
      success('更新成功')
    } else {
      await productStore.create({
        name: formData.value.name!,
        code: formData.value.code!,
        strategyTypeId: formData.value.strategyTypeId!,
        riskLevel: formData.value.riskLevel!,
        annualReturn: formData.value.annualReturn,
        volatility: formData.value.volatility,
        sharpeRatio: formData.value.sharpeRatio,
        maxDrawdown: formData.value.maxDrawdown,
        fundManager: formData.value.fundManager,
        fundScale: formData.value.fundScale,
        inceptionDate: formData.value.inceptionDate,
        description: formData.value.description,
        isActive: formData.value.isActive!,
        sortOrder: formData.value.sortOrder || 0,
      })
      success('创建成功')
    }
    dialogVisible.value = false
  } catch (err: any) {
    showError(err.message || isEdit.value ? '更新失败' : '创建失败')
  }
}

// 排序变化处理
const handleSortChange = () => {
  // 排序变化处理
}

// 根据风险等级获取标签类型
const getRiskTagType = (level: string) => {
  const map: Record<string, any> = {
    '低风险': 'success',
    '中低风险': 'primary',
    '中等风险': 'warning',
    '中高风险': 'danger',
    '高风险': 'danger',
  }
  return map[level] || 'info'
}

// 格式化百分比（小数转百分数字符串）
const formatPercent = (value?: number) => {
  if (value === undefined || value === null) return '-'
  return `${(value * 100).toFixed(2)}%`
}

// 判断是否可以上移
const canMoveUp = (data: ProductDTO) => {
  const index = products.value.findIndex(p => p.id === data.id)
  return index > 0
}

// 判断是否可以下移
const canMoveDown = (data: ProductDTO) => {
  const index = products.value.findIndex(p => p.id === data.id)
  return index < products.value.length - 1
}

// 上移排序
const handleMoveUp = async (data: ProductDTO) => {
  if (canMoveUp(data)) {
    try {
      await productStore.update(data.id, {
        name: data.name,
        riskLevel: data.riskLevel,
        sortOrder: (data.sortOrder || 0) - 1,
      })
      success('排序更新成功')
    } catch (err: any) {
      showError(err.message || '排序更新失败')
    }
  }
}

// 下移排序
const handleMoveDown = async (data: ProductDTO) => {
  if (canMoveDown(data)) {
    try {
      await productStore.update(data.id, {
        name: data.name,
        riskLevel: data.riskLevel,
        sortOrder: (data.sortOrder || 0) + 1,
      })
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

/* 搜索栏样式 */
.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
</style>

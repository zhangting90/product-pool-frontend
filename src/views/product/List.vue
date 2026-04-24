<!-- 产品管理页面：按大分类→子分类→业绩对标→策略类型四级联动筛选，支持搜索、分页，表格展示产品列表 -->
<template>
  <div class="product-list">
    <!-- 页面头部：标题、四级筛选和操作按钮 -->
    <div class="header">
      <h2>产品管理</h2>
      <div class="header-actions">
        <!-- 大分类筛选下拉框 -->
        <el-select
          v-model="selectedMajorType"
          placeholder="选择大分类"
          clearable
          @change="handleMajorTypeChange"
          style="width: 180px"
        >
          <el-option
            v-for="ct in majorTypes"
            :key="ct.id"
            :label="ct.name"
            :value="ct.id"
          />
        </el-select>
        <!-- 子分类筛选下拉框 -->
        <el-select
          v-model="selectedSubType"
          placeholder="选择子分类"
          clearable
          @change="handleSubTypeChange"
          style="width: 180px"
          :disabled="!selectedMajorType"
        >
          <el-option
            v-for="ct in subTypes"
            :key="ct.id"
            :label="ct.name"
            :value="ct.id"
          />
        </el-select>
        <!-- 业绩对标筛选下拉框 -->
        <el-select
          v-model="selectedBenchmark"
          placeholder="选择业绩对标"
          clearable
          @change="handleBenchmarkChange"
          style="width: 180px"
          :disabled="!selectedMajorType"
        >
          <el-option v-for="bm in benchmarks" :key="bm.id" :label="bm.name" :value="bm.id" />
        </el-select>
        <!-- 策略类型筛选下拉框 -->
        <el-select
          v-model="selectedStrategyType"
          placeholder="选择策略类型"
          clearable
          @change="handleStrategyTypeChange"
          style="width: 180px"
        >
          <el-option v-for="st in strategyTypes" :key="st.id" :label="st.name" :value="st.id" />
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
        @change="handleSearch"
      />
      <el-input
        v-model="searchForm.code"
        placeholder="产品代码"
        clearable
        style="width: 200px"
        @change="handleSearch"
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
import { useConfigurationTypeStore } from '@/stores/configuration-type'
import { useBenchmarkStore } from '@/stores/benchmark'
import { useStrategyTypeStore } from '@/stores/strategy-type'
import { useProductStore } from '@/stores/product'
import { useMessage } from '@/composables/useMessage'
import { useConfirm } from '@/composables/useConfirm'
import Table from '@/components/common/Table.vue'
import ProductDialog from './ProductDialog.vue'
import type { ProductDTO } from '@/types/product'

// 初始化store和工具函数
const configurationTypeStore = useConfigurationTypeStore()
const benchmarkStore = useBenchmarkStore()
const strategyTypeStore = useStrategyTypeStore()
const productStore = useProductStore()
const { success, error: showError } = useMessage()
const { confirmDelete } = useConfirm()

// 计算属性：大分类列表
const majorTypes = computed(() => configurationTypeStore.majorTypes)
// 根据选中的大分类过滤子分类列表
const subTypes = computed(() => {
  if (!selectedMajorType.value) return []
  return configurationTypeStore.configurationTypes.filter(
    (ct) => !ct.isMajor && ct.parentId === selectedMajorType.value
  )
})
// 根据选中状态过滤业绩对标列表
const benchmarks = computed(() => {
  const all = benchmarkStore.benchmarks
  if (!selectedMajorType.value) return all
  if (selectedSubType.value) {
    return all.filter((b) => b.configurationTypeId === selectedSubType.value)
  }
  const subTypeIds = configurationTypeStore.configurationTypes
    .filter((ct) => !ct.isMajor && ct.parentId === selectedMajorType.value)
    .map((ct) => ct.id)
  return all.filter((b) => subTypeIds.includes(b.configurationTypeId))
})
// 根据选中状态过滤策略类型列表
const strategyTypes = computed(() => {
  const all = strategyTypeStore.strategyTypes
  if (!selectedBenchmark.value) return all
  return all.filter((st) => st.benchmarkId === selectedBenchmark.value)
})
// 产品列表、加载状态、总数
const products = computed(() => productStore.products)
const loading = computed(() => productStore.loading)
const total = computed(() => productStore.pageResult.totalElements)

// 当前选中的大分类ID、子分类ID、业绩对标ID、策略类型ID
const selectedMajorType = ref<string>()
const selectedSubType = ref<string>()
const selectedBenchmark = ref<string>()
const selectedStrategyType = ref<string>()
// 分页状态
const currentPage = ref(1)
const pageSize = ref(10)
// 搜索表单
const searchForm = ref({
  name: '',
  code: ''
})
// 对话框相关状态
const dialogVisible = ref(false)
const dialogTitle = ref('')
const isEdit = ref(false)
const formData = ref<Partial<ProductDTO>>({})

// 页面挂载时加载所有数据
onMounted(async () => {
  try {
    await Promise.all([
      configurationTypeStore.loadConfigurationTypes(),
      benchmarkStore.loadBenchmarks(),
      strategyTypeStore.loadStrategyTypes()
    ])
    searchProducts()
  } catch (err: any) {
    showError(err.message || '加载数据失败')
  }
})

// 大分类变化：清空后续选项，刷新下级下拉列表，搜索产品
const handleMajorTypeChange = async () => {
  selectedSubType.value = undefined
  selectedBenchmark.value = undefined
  selectedStrategyType.value = undefined
  currentPage.value = 1
  try {
    if (selectedMajorType.value) {
      // 选了大分类，加载该分类下的策略类型
      await strategyTypeStore.loadStrategyTypes({ majorTypeId: selectedMajorType.value })
    } else {
      await strategyTypeStore.loadStrategyTypes()
    }
    searchProducts()
  } catch (err: any) {
    showError(err.message || '加载数据失败')
  }
}

// 子分类变化：清空后续选项，刷新下级下拉列表，搜索产品
const handleSubTypeChange = async () => {
  selectedBenchmark.value = undefined
  selectedStrategyType.value = undefined
  currentPage.value = 1
  try {
    if (selectedSubType.value) {
      await strategyTypeStore.loadStrategyTypes({ subTypeId: selectedSubType.value })
    } else if (selectedMajorType.value) {
      await strategyTypeStore.loadStrategyTypes({ majorTypeId: selectedMajorType.value })
    } else {
      await strategyTypeStore.loadStrategyTypes()
    }
    searchProducts()
  } catch (err: any) {
    showError(err.message || '加载数据失败')
  }
}

// 业绩对标变化：清空后续选项，刷新策略类型列表，搜索产品
const handleBenchmarkChange = async () => {
  selectedStrategyType.value = undefined
  currentPage.value = 1
  try {
    if (selectedBenchmark.value) {
      await strategyTypeStore.loadByBenchmarkId(selectedBenchmark.value)
    } else if (selectedSubType.value) {
      await strategyTypeStore.loadStrategyTypes({ subTypeId: selectedSubType.value })
    } else if (selectedMajorType.value) {
      await strategyTypeStore.loadStrategyTypes({ majorTypeId: selectedMajorType.value })
    } else {
      await strategyTypeStore.loadStrategyTypes()
    }
    searchProducts()
  } catch (err: any) {
    showError(err.message || '加载数据失败')
  }
}

// 策略类型变化：搜索产品
const handleStrategyTypeChange = () => {
  currentPage.value = 1
  searchProducts()
}

// 收集当前选中层级对应的策略类型ID列表
const collectStrategyTypeIds = (): number[] | undefined => {
  // 如果选了具体策略类型，只返回这一个
  if (selectedStrategyType.value) {
    return [Number(selectedStrategyType.value)]
  }
  // 否则取当前策略类型下拉列表中可见的所有ID
  const visibleStrategyTypes = strategyTypes.value
  if (visibleStrategyTypes.length === 0) return undefined
  return visibleStrategyTypes.map((st) => Number(st.id))
}

// 统一搜索产品：选择框筛选 + 名称/代码过滤
const searchProducts = async () => {
  try {
    const params: Record<string, any> = {
      name: searchForm.value.name || undefined,
      code: searchForm.value.code || undefined,
      page: currentPage.value - 1,
      size: pageSize.value
    }
    const ids = collectStrategyTypeIds()
    if (ids) {
      params.strategyTypeIds = ids
    }
    await productStore.searchProducts(params)
  } catch (err: any) {
    showError(err.message || '搜索产品失败')
  }
}

// 搜索处理（重置到第一页）
const handleSearch = () => {
  currentPage.value = 1
  searchProducts()
}

// 重置搜索条件（仅重置名称和代码输入框）
const handleReset = () => {
  searchForm.value = { name: '', code: '' }
  currentPage.value = 1
  searchProducts()
}

// 刷新数据
const handleRefresh = async () => {
  await searchProducts()
}

// 新增产品（需要选择策略类型）
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
      await handleRefresh()
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

// 排序变化处理
const handleSortChange = () => {
  // 排序变化处理
}

// 判断是否可以上移
const canMoveUp = (data: ProductDTO) => {
  const index = products.value.findIndex((p) => p.id === data.id)
  return index > 0
}

// 判断是否可以下移
const canMoveDown = (data: ProductDTO) => {
  const index = products.value.findIndex((p) => p.id === data.id)
  return index < products.value.length - 1
}

// 上移排序
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

// 下移排序
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

/* 搜索栏样式 */
.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
</style>

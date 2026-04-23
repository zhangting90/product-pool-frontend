<!-- 策略类型管理页面：按业绩对标筛选，表格展示策略类型列表 -->
<template>
  <div class="strategy-type-list">
    <!-- 页面头部：标题、业绩对标筛选和操作按钮 -->
    <div class="header">
      <h2>策略类型管理</h2>
      <div class="header-actions">
        <!-- 业绩对标筛选下拉框 -->
        <el-select
          v-model="selectedBenchmark"
          placeholder="选择业绩对标"
          clearable
          @change="handleBenchmarkChange"
          style="width: 200px"
        >
          <el-option v-for="bm in benchmarks" :key="bm.id" :label="bm.name" :value="bm.id" />
        </el-select>
        <el-button type="primary" @click="handleAdd" :disabled="!selectedBenchmark">
          <el-icon><Plus /></el-icon>
          新增策略类型
        </el-button>
        <el-button @click="handleRefresh">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <!-- 策略类型数据表格 -->
    <Table
      :data="strategyTypes"
      :loading="loading"
      :pagination="false"
      @sort-change="handleSortChange"
    >
      <el-table-column label="名称" prop="name" sortable="custom" />
      <el-table-column label="业绩对标" prop="benchmarkName" sortable="custom" />
      <el-table-column label="描述" prop="description" show-overflow-tooltip />
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
    <StrategyTypeDialog
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
import { useBenchmarkStore } from '@/stores/benchmark'
import { useStrategyTypeStore } from '@/stores/strategy-type'
import { useMessage } from '@/composables/useMessage'
import { useConfirm } from '@/composables/useConfirm'
import Table from '@/components/common/Table.vue'
import StrategyTypeDialog from './StrategyTypeDialog.vue'
import type { StrategyTypeDTO } from '@/types/strategy-type'

// 初始化store和工具函数
const benchmarkStore = useBenchmarkStore()
const strategyTypeStore = useStrategyTypeStore()
const { success, error: showError } = useMessage()
const { confirmDelete } = useConfirm()

// 计算属性：业绩对标列表、策略类型列表、加载状态
const benchmarks = computed(() => benchmarkStore.benchmarks)
const strategyTypes = computed(() => strategyTypeStore.strategyTypes)
const loading = computed(() => strategyTypeStore.loading)

// 当前选中的业绩对标ID
const selectedBenchmark = ref<number>()
// 对话框相关状态
const dialogVisible = ref(false)
const dialogTitle = ref('')
const isEdit = ref(false)
const formData = ref<Partial<StrategyTypeDTO>>({})

// 页面挂载时加载业绩对标数据
onMounted(() => {
  loadBenchmarks()
})

// 加载业绩对标列表
const loadBenchmarks = async () => {
  try {
    await benchmarkStore.loadBenchmarks()
  } catch (err: any) {
    showError(err.message || '加载业绩对标失败')
  }
}

// 业绩对标筛选变化处理
const handleBenchmarkChange = () => {
  if (selectedBenchmark.value) {
    loadStrategyTypes()
  } else {
    loadAllStrategyTypes()
  }
}

// 按业绩对标加载策略类型
const loadStrategyTypes = async () => {
  if (!selectedBenchmark.value) return
  try {
    await strategyTypeStore.loadByBenchmarkId(selectedBenchmark.value)
  } catch (err: any) {
    showError(err.message || '加载策略类型失败')
  }
}

// 加载所有策略类型
const loadAllStrategyTypes = async () => {
  try {
    await strategyTypeStore.loadStrategyTypes()
  } catch (err: any) {
    showError(err.message || '加载策略类型失败')
  }
}

// 刷新数据
const handleRefresh = () => {
  if (selectedBenchmark.value) {
    loadStrategyTypes()
  } else {
    loadAllStrategyTypes()
  }
}

// 新增策略类型
const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '新增策略类型'
  formData.value = {
    benchmarkId: selectedBenchmark.value!,
    sortOrder: 0
  }
  dialogVisible.value = true
}

// 编辑策略类型
const handleEdit = (data: StrategyTypeDTO) => {
  isEdit.value = true
  dialogTitle.value = '编辑策略类型'
  formData.value = { ...data }
  dialogVisible.value = true
}

// 删除策略类型（需确认）
const handleDelete = async (data: StrategyTypeDTO) => {
  if (await confirmDelete(`确定要删除 "${data.name}" 吗？`)) {
    try {
      await strategyTypeStore.remove(data.id)
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
      await strategyTypeStore.update(formData.value.id!, {
        name: formData.value.name!,
        description: formData.value.description,
        sortOrder: formData.value.sortOrder
      })
      success('更新成功')
    } else {
      await strategyTypeStore.create({
        name: formData.value.name!,
        benchmarkId: formData.value.benchmarkId!,
        description: formData.value.description,
        sortOrder: formData.value.sortOrder || 0
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

// 判断是否可以上移
const canMoveUp = (data: StrategyTypeDTO) => {
  const index = strategyTypes.value.findIndex((st) => st.id === data.id)
  return index > 0
}

// 判断是否可以下移
const canMoveDown = (data: StrategyTypeDTO) => {
  const index = strategyTypes.value.findIndex((st) => st.id === data.id)
  return index < strategyTypes.value.length - 1
}

// 上移排序
const handleMoveUp = async (data: StrategyTypeDTO) => {
  if (canMoveUp(data)) {
    try {
      await strategyTypeStore.update(data.id, {
        name: data.name,
        sortOrder: (data.sortOrder || 0) - 1
      })
      success('排序更新成功')
    } catch (err: any) {
      showError(err.message || '排序更新失败')
    }
  }
}

// 下移排序
const handleMoveDown = async (data: StrategyTypeDTO) => {
  if (canMoveDown(data)) {
    try {
      await strategyTypeStore.update(data.id, {
        name: data.name,
        sortOrder: (data.sortOrder || 0) + 1
      })
      success('排序更新成功')
    } catch (err: any) {
      showError(err.message || '排序更新失败')
    }
  }
}
</script>

<style scoped>
.strategy-type-list {
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
</style>

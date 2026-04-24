<!-- 业绩对标管理页面：按配置类型筛选，表格展示业绩对标列表 -->
<template>
  <div class="benchmark-list">
    <!-- 页面头部：标题、配置类型筛选和操作按钮 -->
    <div class="header">
      <h2>业绩对标管理</h2>
      <div class="header-actions">
        <!-- 大分类筛选下拉框 -->
        <el-select
          v-model="selectedMajorType"
          placeholder="选择大分类"
          clearable
          @change="handleMajorTypeChange"
          style="width: 200px"
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
          style="width: 200px"
          :disabled="!selectedMajorType"
        >
          <el-option
            v-for="ct in subTypes"
            :key="ct.id"
            :label="ct.name"
            :value="ct.id"
          />
        </el-select>
        <el-button type="primary" @click="handleAdd" :disabled="!selectedSubType">
          <el-icon><Plus /></el-icon>
          新增业绩对标
        </el-button>
        <el-button @click="handleRefresh">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <!-- 业绩对标数据表格 -->
    <Table
      :data="benchmarks"
      :loading="loading"
      :pagination="false"
      @sort-change="handleSortChange"
    >
      <el-table-column label="名称" prop="name" sortable="custom" />
      <el-table-column label="配置类型" prop="configurationTypeName" sortable="custom" />
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
    <BenchmarkDialog
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
import { useMessage } from '@/composables/useMessage'
import { useConfirm } from '@/composables/useConfirm'
import Table from '@/components/common/Table.vue'
import BenchmarkDialog from './BenchmarkDialog.vue'
import type { BenchmarkDTO } from '@/types/benchmark'

// 初始化store和工具函数
const configurationTypeStore = useConfigurationTypeStore()
const benchmarkStore = useBenchmarkStore()
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
// 根据选中状态过滤业绩对标：选了子分类用子分类ID过滤，仅选大分类按子分类ID集合过滤，都没选显示全部
const benchmarks = computed(() => {
  const all = benchmarkStore.benchmarks
  if (selectedSubType.value) {
    return all
  }
  if (selectedMajorType.value) {
    const subTypeIds = configurationTypeStore.configurationTypes
      .filter((ct) => !ct.isMajor && ct.parentId === selectedMajorType.value)
      .map((ct) => ct.id)
    return all.filter((b) => subTypeIds.includes(b.configurationTypeId))
  }
  return all
})
const loading = computed(() => benchmarkStore.loading)

// 当前选中的大分类ID和子分类ID
const selectedMajorType = ref<string>()
const selectedSubType = ref<string>()
// 对话框相关状态
const dialogVisible = ref(false)
const dialogTitle = ref('')
const isEdit = ref(false)
const formData = ref<Partial<BenchmarkDTO>>({})

// 页面挂载时加载配置类型数据
onMounted(() => {
  loadConfigurationTypes()
})

// 加载所有配置类型数据（大分类+子分类）
const loadConfigurationTypes = async () => {
  try {
    await configurationTypeStore.loadConfigurationTypes()
  } catch (err: any) {
    showError(err.message || '加载配置类型失败')
  }
}

// 大分类变化处理：清空子分类选择，加载全部业绩对标
const handleMajorTypeChange = () => {
  selectedSubType.value = undefined
  loadAllBenchmarks()
}

// 子分类变化处理：加载对应的业绩对标
const handleSubTypeChange = () => {
  if (selectedSubType.value) {
    loadBenchmarks()
  } else {
    loadAllBenchmarks()
  }
}

// 按子分类加载业绩对标
const loadBenchmarks = async () => {
  if (!selectedSubType.value) return
  try {
    await benchmarkStore.loadByConfigurationTypeId(selectedSubType.value)
  } catch (err: any) {
    showError(err.message || '加载业绩对标失败')
  }
}

// 加载所有业绩对标
const loadAllBenchmarks = async () => {
  try {
    await benchmarkStore.loadBenchmarks()
  } catch (err: any) {
    showError(err.message || '加载业绩对标失败')
  }
}

// 刷新数据
const handleRefresh = async () => {
  if (selectedSubType.value) {
    await loadBenchmarks()
  } else {
    await loadAllBenchmarks()
  }
}

// 新增业绩对标（使用选中的子分类ID）
const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '新增业绩对标'
  formData.value = {
    configurationTypeId: selectedSubType.value!,
    sortOrder: 0
  }
  dialogVisible.value = true
}

// 编辑业绩对标
const handleEdit = (data: BenchmarkDTO) => {
  isEdit.value = true
  dialogTitle.value = '编辑业绩对标'
  formData.value = { ...data }
  dialogVisible.value = true
}

// 删除业绩对标（需确认）
const handleDelete = async (data: BenchmarkDTO) => {
  if (await confirmDelete(`确定要删除 "${data.name}" 吗？`)) {
    try {
      await benchmarkStore.remove(data.id)
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
      await benchmarkStore.update(formData.value.id!, {
        name: formData.value.name!,
        description: formData.value.description,
        sortOrder: formData.value.sortOrder
      })
    } else {
      await benchmarkStore.create({
        name: formData.value.name!,
        description: formData.value.description,
        configurationTypeId: formData.value.configurationTypeId!,
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
const canMoveUp = (data: BenchmarkDTO) => {
  const index = benchmarks.value.findIndex((b) => b.id === data.id)
  return index > 0
}

// 判断是否可以下移
const canMoveDown = (data: BenchmarkDTO) => {
  const index = benchmarks.value.findIndex((b) => b.id === data.id)
  return index < benchmarks.value.length - 1
}

// 上移排序
const handleMoveUp = async (data: BenchmarkDTO) => {
  if (canMoveUp(data)) {
    try {
      await benchmarkStore.update(data.id, {
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
const handleMoveDown = async (data: BenchmarkDTO) => {
  if (canMoveDown(data)) {
    try {
      await benchmarkStore.update(data.id, {
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
.benchmark-list {
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

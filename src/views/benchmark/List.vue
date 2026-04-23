<template>
  <div class="benchmark-list">
    <div class="header">
      <h2>业绩对标管理</h2>
      <div class="header-actions">
        <el-select
          v-model="selectedConfigurationType"
          placeholder="选择配置类型"
          clearable
          @change="handleConfigurationTypeChange"
          style="width: 200px"
        >
          <el-option
            v-for="ct in configurationTypes"
            :key="ct.id"
            :label="ct.name"
            :value="ct.id"
          />
        </el-select>
        <el-button type="primary" @click="handleAdd" :disabled="!selectedConfigurationType">
          <el-icon><Plus /></el-icon>
          新增业绩对标
        </el-button>
        <el-button @click="handleRefresh">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <Table
      :data="benchmarks"
      :loading="loading"
      :pagination="false"
      @sort-change="handleSortChange"
    >
      <el-table-column label="名称" prop="name" sortable="custom" />
      <el-table-column label="代码" prop="code" sortable="custom" />
      <el-table-column label="配置类型" prop="configurationTypeName" sortable="custom" />
      <el-table-column label="描述" prop="description" show-overflow-tooltip />
      <el-table-column label="排序" prop="sortOrder" sortable="custom" width="100" />
      <el-table-column label="操作" width="240" fixed="right">
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

const configurationTypeStore = useConfigurationTypeStore()
const benchmarkStore = useBenchmarkStore()
const { success, error: showError } = useMessage()
const { confirmDelete } = useConfirm()

const configurationTypes = computed(() => configurationTypeStore.majorTypes)
const benchmarks = computed(() => benchmarkStore.benchmarks)
const loading = computed(() => benchmarkStore.loading)

const selectedConfigurationType = ref<number>()
const dialogVisible = ref(false)
const dialogTitle = ref('')
const isEdit = ref(false)
const formData = ref<Partial<BenchmarkDTO>>({})

onMounted(() => {
  loadConfigurationTypes()
})

const loadConfigurationTypes = async () => {
  try {
    await configurationTypeStore.loadMajorTypes()
  } catch (err: any) {
    showError(err.message || '加载配置类型失败')
  }
}

const handleConfigurationTypeChange = () => {
  if (selectedConfigurationType.value) {
    loadBenchmarks()
  } else {
    loadAllBenchmarks()
  }
}

const loadBenchmarks = async () => {
  if (!selectedConfigurationType.value) return
  try {
    await benchmarkStore.loadByConfigurationTypeId(selectedConfigurationType.value)
  } catch (err: any) {
    showError(err.message || '加载业绩对标失败')
  }
}

const loadAllBenchmarks = async () => {
  try {
    await benchmarkStore.loadBenchmarks()
  } catch (err: any) {
    showError(err.message || '加载业绩对标失败')
  }
}

const handleRefresh = () => {
  if (selectedConfigurationType.value) {
    loadBenchmarks()
  } else {
    loadAllBenchmarks()
  }
}

const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '新增业绩对标'
  formData.value = {
    configurationTypeId: selectedConfigurationType.value!,
    sortOrder: 0,
  }
  dialogVisible.value = true
}

const handleEdit = (data: BenchmarkDTO) => {
  isEdit.value = true
  dialogTitle.value = '编辑业绩对标'
  formData.value = { ...data }
  dialogVisible.value = true
}

const handleDelete = async (data: BenchmarkDTO) => {
  if (await confirmDelete(`确定要删除 "${data.name}" 吗？`)) {
    try {
      await benchmarkStore.remove(data.id)
      success('删除成功')
    } catch (err: any) {
      showError(err.message || '删除失败')
    }
  }
}

const handleConfirm = async () => {
  try {
    if (isEdit.value) {
      await benchmarkStore.update(formData.value.id!, {
        name: formData.value.name!,
        description: formData.value.description,
        sortOrder: formData.value.sortOrder,
      })
      success('更新成功')
    } else {
      await benchmarkStore.create({
        name: formData.value.name!,
        code: formData.value.code!,
        description: formData.value.description,
        configurationTypeId: formData.value.configurationTypeId!,
        sortOrder: formData.value.sortOrder || 0,
      })
      success('创建成功')
    }
    dialogVisible.value = false
  } catch (err: any) {
    showError(err.message || isEdit.value ? '更新失败' : '创建失败')
  }
}

const handleSortChange = () => {
  // 排序变化处理
}

const canMoveUp = (data: BenchmarkDTO) => {
  const index = benchmarks.value.findIndex(b => b.id === data.id)
  return index > 0
}

const canMoveDown = (data: BenchmarkDTO) => {
  const index = benchmarks.value.findIndex(b => b.id === data.id)
  return index < benchmarks.value.length - 1
}

const handleMoveUp = async (data: BenchmarkDTO) => {
  if (canMoveUp(data)) {
    try {
      await benchmarkStore.update(data.id, {
        name: data.name,
        sortOrder: (data.sortOrder || 0) - 1,
      })
      success('排序更新成功')
    } catch (err: any) {
      showError(err.message || '排序更新失败')
    }
  }
}

const handleMoveDown = async (data: BenchmarkDTO) => {
  if (canMoveDown(data)) {
    try {
      await benchmarkStore.update(data.id, {
        name: data.name,
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

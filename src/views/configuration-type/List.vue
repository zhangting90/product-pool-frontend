<template>
  <div class="configuration-type-list">
    <div class="header">
      <h2>配置类型管理</h2>
      <div class="header-actions">
        <el-button type="primary" @click="handleAddMajor">
          <el-icon><Plus /></el-icon>
          新增大分类
        </el-button>
        <el-button @click="handleRefresh">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <div class="content">
      <el-tree
        :data="treeData"
        :props="treeProps"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        ref="treeRef"
      >
        <template #default="{ node, data }">
          <div class="tree-node">
            <span class="node-label">{{ node.label }}</span>
            <span class="node-code">({{ data.code }})</span>
            <span v-if="data.description" class="node-desc">{{ data.description }}</span>
            <div class="node-actions">
              <el-button
                v-if="data.isMajor"
                type="primary"
                size="small"
                @click="handleAddSub(data)"
              >
                新增子类
              </el-button>
              <el-button size="small" @click="handleEdit(data)">编辑</el-button>
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(data)"
              >
                删除
              </el-button>
              <el-button
                size="small"
                @click="handleMoveUp(data)"
                :disabled="!canMoveUp(data)"
              >
                <el-icon><ArrowUp /></el-icon>
              </el-button>
              <el-button
                size="small"
                @click="handleMoveDown(data)"
                :disabled="!canMoveDown(data)"
              >
                <el-icon><ArrowDown /></el-icon>
              </el-button>
            </div>
          </div>
        </template>
      </el-tree>
    </div>

    <!-- 编辑对话框 -->
    <ConfigurationTypeDialog
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
import { useMessage } from '@/composables/useMessage'
import { useConfirm } from '@/composables/useConfirm'
import ConfigurationTypeDialog from './ConfigurationTypeDialog.vue'
import type { ConfigurationTypeDTO } from '@/types/configuration-type'

const configurationTypeStore = useConfigurationTypeStore()
const { success, error: showError } = useMessage()
const { confirmDelete } = useConfirm()

const treeRef = ref()
const treeData = computed(() => configurationTypeStore.configurationTypes)
const loading = computed(() => configurationTypeStore.loading)

const treeProps = {
  children: 'children',
  label: 'name',
}

const dialogVisible = ref(false)
const dialogTitle = ref('')
const isEdit = ref(false)
const formData = ref<Partial<ConfigurationTypeDTO>>({})

onMounted(() => {
  loadData()
})

const loadData = async () => {
  try {
    await configurationTypeStore.loadHierarchy()
    success('加载成功')
  } catch (err: any) {
    showError(err.message || '加载失败')
  }
}

const handleRefresh = () => {
  loadData()
}

const handleAddMajor = () => {
  isEdit.value = false
  dialogTitle.value = '新增大分类'
  formData.value = {
    isMajor: true,
    sortOrder: 0,
  }
  dialogVisible.value = true
}

const handleAddSub = (parentData: ConfigurationTypeDTO) => {
  isEdit.value = false
  dialogTitle.value = `新增 ${parentData.name} 子类`
  formData.value = {
    parentId: parentData.id,
    isMajor: false,
    sortOrder: 0,
  }
  dialogVisible.value = true
}

const handleEdit = (data: ConfigurationTypeDTO) => {
  isEdit.value = true
  dialogTitle.value = data.isMajor ? '编辑大分类' : '编辑子类'
  formData.value = { ...data }
  dialogVisible.value = true
}

const handleDelete = async (data: ConfigurationTypeDTO) => {
  if (await confirmDelete(`确定要删除 "${data.name}" 吗？`)) {
    try {
      await configurationTypeStore.remove(data.id)
      success('删除成功')
    } catch (err: any) {
      showError(err.message || '删除失败')
    }
  }
}

const handleConfirm = async () => {
  try {
    if (isEdit.value) {
      await configurationTypeStore.update(formData.value.id!, {
        name: formData.value.name!,
        description: formData.value.description,
        sortOrder: formData.value.sortOrder,
      })
      success('更新成功')
    } else {
      await configurationTypeStore.create({
        name: formData.value.name!,
        code: formData.value.code!,
        description: formData.value.description,
        isMajor: formData.value.isMajor!,
        parentId: formData.value.parentId,
        sortOrder: formData.value.sortOrder || 0,
      })
      success('创建成功')
    }
    dialogVisible.value = false
  } catch (err: any) {
    showError(err.message || isEdit.value ? '更新失败' : '创建失败')
  }
}

const canMoveUp = (data: ConfigurationTypeDTO) => {
  if (data.isMajor) {
    const index = treeData.value.findIndex(item => item.id === data.id)
    return index > 0
  } else {
    const parent = treeData.value.find(item =>
      item.children?.some(child => child.id === data.id)
    )
    if (!parent || !parent.children) return false
    const index = parent.children.findIndex(child => child.id === data.id)
    return index > 0
  }
}

const canMoveDown = (data: ConfigurationTypeDTO) => {
  if (data.isMajor) {
    const index = treeData.value.findIndex(item => item.id === data.id)
    return index < treeData.value.length - 1
  } else {
    const parent = treeData.value.find(item =>
      item.children?.some(child => child.id === data.id)
    )
    if (!parent || !parent.children) return false
    const index = parent.children.findIndex(child => child.id === data.id)
    return index < parent.children.length - 1
  }
}

const handleMoveUp = async (data: ConfigurationTypeDTO) => {
  if (canMoveUp(data)) {
    try {
      await configurationTypeStore.update(data.id, {
        name: data.name,
        sortOrder: (data.sortOrder || 0) - 1,
      })
      success('排序更新成功')
    } catch (err: any) {
      showError(err.message || '排序更新失败')
    }
  }
}

const handleMoveDown = async (data: ConfigurationTypeDTO) => {
  if (canMoveDown(data)) {
    try {
      await configurationTypeStore.update(data.id, {
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
.configuration-type-list {
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

.content {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tree-node {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 0;
  width: 100%;
}

.node-label {
  font-weight: 500;
}

.node-code {
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

.node-desc {
  color: var(--el-text-color-regular);
  font-size: 13px;
}

.node-actions {
  margin-left: auto;
  display: flex;
  gap: 5px;
}
</style>

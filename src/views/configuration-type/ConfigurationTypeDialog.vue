<!-- 配置类型编辑对话框：新增或编辑配置类型的表单弹窗 -->
<template>
  <FormDialog
    v-model:visible="dialogVisible"
    v-model="formData"
    :title="title"
    :rules="formRules"
    @submit="handleConfirm"
  >
    <template #form>
      <!-- 配置类型名称 -->
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入配置类型名称" />
      </el-form-item>

      <!-- 描述信息 -->
      <el-form-item label="描述">
        <el-input v-model="formData.description" type="textarea" :rows="3" placeholder="请输入描述" />
      </el-form-item>

      <!-- 父分类显示（编辑子类时展示） -->
      <el-form-item v-if="formData.parentId" label="父分类">
        <el-input :value="getParentName()" disabled />
      </el-form-item>

      <!-- 排序号 -->
      <el-form-item label="排序">
        <el-input-number v-model="formData.sortOrder" :min="0" :step="1" />
      </el-form-item>
    </template>
  </FormDialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import FormDialog from '@/components/common/FormDialog.vue'
import { useConfigurationTypeStore } from '@/stores/configuration-type'
import type { ConfigurationTypeDTO } from '@/types/configuration-type'

// 组件属性和事件定义
interface Props {
  visible: boolean // 是否显示对话框
  modelValue: Partial<ConfigurationTypeDTO> // 表单数据（v-model）
  title: string // 对话框标题
  isEdit: boolean // 是否编辑模式
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'update:modelValue', value: Partial<ConfigurationTypeDTO>): void
  (e: 'confirm'): void // 确认提交事件
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const configurationTypeStore = useConfigurationTypeStore()

// 对话框显示状态的双向绑定
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

// 表单数据的双向绑定
const formData = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 表单验证规则
const formRules = {
  name: [{ required: true, message: '请输入配置类型名称', trigger: 'blur' }]
}

// 获取父分类名称
const getParentName = () => {
  if (!formData.value.parentId) return ''
  const parent = configurationTypeStore.configurationTypes.find(
    (ct) => ct.id === formData.value.parentId
  )
  return parent?.name || ''
}

// 触发确认事件，将FormDialog内部表单数据同步回父组件
const handleConfirm = (data: Record<string, any>) => {
  emit('update:modelValue', data as Partial<ConfigurationTypeDTO>)
  emit('confirm')
}
</script>

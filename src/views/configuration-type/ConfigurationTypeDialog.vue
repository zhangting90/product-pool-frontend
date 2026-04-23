<template>
  <FormDialog
    v-model:visible="dialogVisible"
    v-model="formData"
    :title="title"
    :rules="formRules"
    @confirm="handleConfirm"
  >
    <el-form-item label="名称" prop="name">
      <el-input v-model="formData.name" placeholder="请输入配置类型名称" />
    </el-form-item>

    <el-form-item label="代码" prop="code" v-if="!isEdit">
      <el-input v-model="formData.code" placeholder="请输入配置类型代码" />
    </el-form-item>

    <el-form-item label="描述">
      <el-input
        v-model="formData.description"
        type="textarea"
        :rows="3"
        placeholder="请输入描述"
      />
    </el-form-item>

    <el-form-item v-if="formData.parentId" label="父分类">
      <el-input :value="getParentName()" disabled />
    </el-form-item>

    <el-form-item label="排序">
      <el-input-number
        v-model="formData.sortOrder"
        :min="0"
        :step="1"
      />
    </el-form-item>
  </FormDialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import FormDialog from '@/components/common/FormDialog.vue'
import { useConfigurationTypeStore } from '@/stores/configuration-type'
import type { ConfigurationTypeDTO } from '@/types/configuration-type'

interface Props {
  visible: boolean
  modelValue: Partial<ConfigurationTypeDTO>
  title: string
  isEdit: boolean
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'update:modelValue', value: Partial<ConfigurationTypeDTO>): void
  (e: 'confirm'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const configurationTypeStore = useConfigurationTypeStore()

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
})

const formData = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const formRules = {
  name: [{ required: true, message: '请输入配置类型名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入配置类型代码', trigger: 'blur' }],
}

const getParentName = () => {
  if (!formData.value.parentId) return ''
  const parent = configurationTypeStore.configurationTypes.find(
    ct => ct.id === formData.value.parentId
  )
  return parent?.name || ''
}

const handleConfirm = () => {
  emit('confirm')
}
</script>

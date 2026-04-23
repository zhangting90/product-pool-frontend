<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    :width="width"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :before-close="handleClose"
    @open="handleOpen"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      :label-width="labelWidth"
      :label-position="labelPosition"
      :size="size"
    >
      <slot name="form"></slot>
    </el-form>

    <template #footer>
      <slot name="footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" :loading="loading" @click="handleSubmit">
          {{ submitText }}
        </el-button>
      </slot>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

interface Props {
  visible: boolean
  title: string
  width?: string | number
  modelValue: Record<string, any>
  rules?: FormRules
  labelWidth?: string | number
  labelPosition?: 'left' | 'right' | 'top'
  size?: 'large' | 'default' | 'small'
  loading?: boolean
  submitText?: string
  closeOnClickModal?: boolean
  closeOnPressEscape?: boolean
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'update:modelValue', value: Record<string, any>): void
  (e: 'submit', data: Record<string, any>): void
  (e: 'open'): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  width: '500px',
  labelWidth: '100px',
  labelPosition: 'right',
  size: 'default',
  loading: false,
  submitText: '确定',
  closeOnClickModal: false,
  closeOnPressEscape: true,
})

const emit = defineEmits<Emits>()

const formRef = ref<FormInstance>()
const dialogVisible = ref(props.visible)
const formData = ref<Record<string, any>>({ ...props.modelValue })

watch(
  () => props.visible,
  (val) => {
    dialogVisible.value = val
  }
)

watch(
  () => props.modelValue,
  (val) => {
    formData.value = { ...val }
  },
  { deep: true }
)

watch(dialogVisible, (val) => {
  emit('update:visible', val)
})

watch(formData, (val) => {
  emit('update:modelValue', val)
}, { deep: true })

const handleOpen = async () => {
  await nextTick()
  emit('open')
}

const handleClose = () => {
  emit('close')
  dialogVisible.value = false
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    emit('submit', formData.value)
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

const validate = async () => {
  if (!formRef.value) return false
  try {
    await formRef.value.validate()
    return true
  } catch {
    return false
  }
}

const resetFields = () => {
  formRef.value?.resetFields()
}

const clearValidate = () => {
  formRef.value?.clearValidate()
}

defineExpose({
  validate,
  resetFields,
  clearValidate,
})
</script>

<style scoped>
.el-form {
  padding: 20px;
}
</style>

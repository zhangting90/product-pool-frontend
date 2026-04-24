<!-- 表单对话框组件：封装带表单验证的弹窗 -->
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
    <!-- 表单区域，支持通过插槽自定义表单项 -->
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

    <!-- 底部按钮区域，支持通过插槽自定义 -->
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

// 组件属性定义
interface Props {
  visible: boolean // 是否显示对话框
  title: string // 对话框标题
  width?: string | number // 对话框宽度
  modelValue: Record<string, any> // 表单数据（v-model）
  rules?: FormRules // 表单验证规则
  labelWidth?: string | number // 标签宽度
  labelPosition?: 'left' | 'right' | 'top' // 标签位置
  size?: 'large' | 'default' | 'small' // 表单尺寸
  loading?: boolean // 提交按钮加载状态
  submitText?: string // 提交按钮文字
  closeOnClickModal?: boolean // 点击遮罩关闭
  closeOnPressEscape?: boolean // 按ESC关闭
}

// 组件事件定义
interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'update:modelValue', value: Record<string, any>): void
  (e: 'submit', data: Record<string, any>): void // 表单提交事件
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
  closeOnPressEscape: true
})

const emit = defineEmits<Emits>()

// 表单引用和数据
const formRef = ref<FormInstance>()
const dialogVisible = ref(props.visible)
const formData = ref<Record<string, any>>({ ...props.modelValue })

// 监听外部visible变化，同步到内部
watch(
  () => props.visible,
  (val) => {
    dialogVisible.value = val
  }
)

// 监听外部表单数据变化，同步到内部
watch(
  () => props.modelValue,
  (val) => {
    formData.value = { ...val }
  },
  { deep: true }
)

// 监听内部对话框状态，向外部同步
watch(dialogVisible, (val) => {
  emit('update:visible', val)
})

// 表单数据变化时同步到外部（通过 submit 事件传递最终数据）
// 注意：不再使用 deep watch 监听 formData 变化后 emit update:modelValue，
// 因为这会与 props.modelValue 的 deep watch 形成无限递归循环

// 对话框打开回调
const handleOpen = async () => {
  formData.value = { ...props.modelValue }
  await nextTick()
  formRef.value?.clearValidate()
  emit('open')
}

// 关闭对话框
const handleClose = () => {
  emit('close')
  dialogVisible.value = false
}

// 提交表单，先验证再触发提交事件
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    emit('submit', formData.value)
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 手动验证表单
const validate = async () => {
  if (!formRef.value) return false
  try {
    await formRef.value.validate()
    return true
  } catch {
    return false
  }
}

// 重置表单字段
const resetFields = () => {
  formRef.value?.resetFields()
}

// 清除表单验证状态
const clearValidate = () => {
  formRef.value?.clearValidate()
}

// 暴露方法供父组件调用
defineExpose({
  validate,
  resetFields,
  clearValidate
})
</script>

<style scoped>
.el-form {
  padding: 20px;
}
</style>

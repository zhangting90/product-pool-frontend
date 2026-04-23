<!-- 通用对话框组件：封装el-dialog，支持确认/取消按钮 -->
<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    :width="width"
    :fullscreen="fullscreen"
    :top="top"
    :modal="modal"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :show-close="showClose"
    :before-close="handleClose"
    :destroy-on-close="destroyOnClose"
    @open="handleOpen"
    @opened="handleOpened"
    @close="handleCloseEvent"
    @closed="handleClosed"
  >
    <!-- 默认插槽，用于自定义对话框内容 -->
    <slot></slot>

    <!-- 底部按钮区域 -->
    <template #footer v-if="!hideFooter">
      <slot name="footer">
        <el-button @click="handleClose">{{ cancelText }}</el-button>
        <el-button type="primary" :loading="loading" @click="handleConfirm">
          {{ confirmText }}
        </el-button>
      </slot>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { watch } from 'vue'

// 组件属性定义
interface Props {
  visible: boolean // 是否显示对话框
  title?: string // 对话框标题
  width?: string | number // 对话框宽度
  fullscreen?: boolean // 是否全屏
  top?: string // 距顶部距离
  modal?: boolean // 是否显示遮罩
  closeOnClickModal?: boolean // 点击遮罩关闭
  closeOnPressEscape?: boolean // 按ESC关闭
  showClose?: boolean // 是否显示关闭按钮
  destroyOnClose?: boolean // 关闭时是否销毁内容
  hideFooter?: boolean // 是否隐藏底部按钮
  loading?: boolean // 确认按钮加载状态
  confirmText?: string // 确认按钮文字
  cancelText?: string // 取消按钮文字
}

// 组件事件定义
interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'confirm'): void // 确认事件
  (e: 'cancel'): void // 取消事件
  (e: 'open'): void // 打开动画开始
  (e: 'opened'): void // 打开动画结束
  (e: 'close'): void // 关闭动画开始
  (e: 'closed'): void // 关闭动画结束
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  width: '500px',
  fullscreen: false,
  top: '15vh',
  modal: true,
  closeOnClickModal: false,
  closeOnPressEscape: true,
  showClose: true,
  destroyOnClose: false,
  hideFooter: false,
  loading: false,
  confirmText: '确定',
  cancelText: '取消'
})

const emit = defineEmits<Emits>()

const dialogVisible = props.visible

// 监听外部visible变化，同步到内部对话框
watch(
  () => props.visible,
  (val) => {
    dialogVisible.value = val
  }
)

// 打开动画开始回调
const handleOpen = () => {
  emit('open')
}

// 打开动画结束回调
const handleOpened = () => {
  emit('opened')
}

// 关闭对话框处理
const handleClose = () => {
  emit('cancel')
  emit('update:visible', false)
}

// 确认按钮点击处理
const handleConfirm = () => {
  emit('confirm')
}

// 关闭动画开始回调
const handleCloseEvent = () => {
  emit('close')
}

// 关闭动画结束回调
const handleClosed = () => {
  emit('closed')
}
</script>

<style scoped>
:deep(.el-dialog__body) {
  padding: 20px;
}
</style>

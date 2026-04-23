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
    <slot></slot>

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

interface Props {
  visible: boolean
  title?: string
  width?: string | number
  fullscreen?: boolean
  top?: string
  modal?: boolean
  closeOnClickModal?: boolean
  closeOnPressEscape?: boolean
  showClose?: boolean
  destroyOnClose?: boolean
  hideFooter?: boolean
  loading?: boolean
  confirmText?: string
  cancelText?: string
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
  (e: 'open'): void
  (e: 'opened'): void
  (e: 'close'): void
  (e: 'closed'): void
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
  cancelText: '取消',
})

const emit = defineEmits<Emits>()

const dialogVisible = props.visible

watch(
  () => props.visible,
  (val) => {
    dialogVisible.value = val
  }
)

const handleOpen = () => {
  emit('open')
}

const handleOpened = () => {
  emit('opened')
}

const handleClose = () => {
  emit('cancel')
  emit('update:visible', false)
}

const handleConfirm = () => {
  emit('confirm')
}

const handleCloseEvent = () => {
  emit('close')
}

const handleClosed = () => {
  emit('closed')
}
</script>

<style scoped>
:deep(.el-dialog__body) {
  padding: 20px;
}
</style>

import { ElMessage } from 'element-plus'
import type { MessageParams } from 'element-plus'

export function useMessage() {
  const success = (message: string, options?: Partial<MessageParams>) => {
    return ElMessage({
      message,
      type: 'success',
      duration: 3000,
      ...options,
    })
  }

  const warning = (message: string, options?: Partial<MessageParams>) => {
    return ElMessage({
      message,
      type: 'warning',
      duration: 3000,
      ...options,
    })
  }

  const info = (message: string, options?: Partial<MessageParams>) => {
    return ElMessage({
      message,
      type: 'info',
      duration: 3000,
      ...options,
    })
  }

  const error = (message: string, options?: Partial<MessageParams>) => {
    return ElMessage({
      message,
      type: 'error',
      duration: 5000,
      ...options,
    })
  }

  return {
    success,
    warning,
    info,
    error,
  }
}

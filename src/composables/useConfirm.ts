import { ElMessageBox } from 'element-plus'
import type { ElMessageBoxOptions } from 'element-plus'

export interface ConfirmOptions extends Partial<ElMessageBoxOptions> {
  title?: string
  message: string
  confirmButtonText?: string
  cancelButtonText?: string
  type?: 'success' | 'warning' | 'info' | 'error'
}

export function useConfirm() {
  const confirm = (options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      ElMessageBox.confirm(
        options.message,
        options.title || '确认操作',
        {
          confirmButtonText: options.confirmButtonText || '确定',
          cancelButtonText: options.cancelButtonText || '取消',
          type: options.type || 'warning',
          draggable: true,
          ...options,
        }
      )
        .then(() => {
          resolve(true)
        })
        .catch(() => {
          resolve(false)
        })
    })
  }

  const confirmDelete = (message?: string): Promise<boolean> => {
    return confirm({
      message: message || '此操作将永久删除该数据，是否继续？',
      type: 'warning',
    })
  }

  return {
    confirm,
    confirmDelete,
  }
}

/**
 * 确认对话框组合式函数
 * 封装ElMessageBox.confirm，提供通用的确认和删除确认功能
 */
import { ElMessageBox } from 'element-plus'
import type { ElMessageBoxOptions } from 'element-plus'

// 确认对话框选项接口
export interface ConfirmOptions extends Partial<ElMessageBoxOptions> {
  title?: string // 对话框标题
  message: string // 提示消息
  confirmButtonText?: string // 确认按钮文字
  cancelButtonText?: string // 取消按钮文字
  type?: 'success' | 'warning' | 'info' | 'error' // 消息类型
}

export function useConfirm() {
  /**
   * 显示确认对话框
   * @param options 确认对话框配置选项
   * @returns Promise<boolean> 用户点击确认为true，取消为false
   */
  const confirm = (options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      ElMessageBox.confirm(options.message, options.title || '确认操作', {
        confirmButtonText: options.confirmButtonText || '确定',
        cancelButtonText: options.cancelButtonText || '取消',
        type: options.type || 'warning',
        draggable: true,
        ...options
      })
        .then(() => {
          resolve(true)
        })
        .catch(() => {
          resolve(false)
        })
    })
  }

  /**
   * 删除确认对话框
   * @param message 可选的自定义提示消息
   * @returns Promise<boolean> 用户确认删除返回true，否则返回false
   */
  const confirmDelete = (message?: string): Promise<boolean> => {
    return confirm({
      message: message || '此操作将永久删除该数据，是否继续？',
      type: 'warning'
    })
  }

  return {
    confirm,
    confirmDelete
  }
}

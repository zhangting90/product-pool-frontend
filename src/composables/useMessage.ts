/**
 * 消息提示组合式函数
 * 封装ElMessage，提供success/warning/info/error四种消息提示方法
 */
import { ElMessage } from 'element-plus'
import type { MessageParams } from 'element-plus'

export function useMessage() {
  /**
   * 显示成功消息
   * @param message 消息内容
   * @param options 可选的ElMessage配置
   */
  const success = (message: string, options?: Partial<MessageParams>) => {
    return ElMessage({
      message,
      type: 'success',
      duration: 3000,
      ...options,
    })
  }

  /**
   * 显示警告消息
   * @param message 消息内容
   * @param options 可选的ElMessage配置
   */
  const warning = (message: string, options?: Partial<MessageParams>) => {
    return ElMessage({
      message,
      type: 'warning',
      duration: 3000,
      ...options,
    })
  }

  /**
   * 显示信息消息
   * @param message 消息内容
   * @param options 可选的ElMessage配置
   */
  const info = (message: string, options?: Partial<MessageParams>) => {
    return ElMessage({
      message,
      type: 'info',
      duration: 3000,
      ...options,
    })
  }

  /**
   * 显示错误消息（持续5秒）
   * @param message 消息内容
   * @param options 可选的ElMessage配置
   */
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

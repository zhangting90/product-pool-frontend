/**
 * 加载状态组合式函数
 * 提供组件内加载状态和全局加载遮罩两种模式
 */
import { ref } from 'vue'
import { ElLoading } from 'element-plus'
import type { LoadingInstance } from 'element-plus/es/components/loading/src/loading'

// 加载选项接口
interface LoadingOptions {
  text?: string // 加载提示文字
  background?: string // 遮罩背景色
  fullscreen?: boolean // 是否全屏
  lock?: boolean // 是否锁定滚动
}

// 全局加载实例
let loadingInstance: LoadingInstance | null = null

/**
 * 组件内加载状态管理
 * 提供visible响应式状态和show/hide方法
 */
export function useLoading() {
  const visible = ref(false)
  const text = ref('')

  // 显示加载状态
  const show = (options: LoadingOptions = {}) => {
    visible.value = true
    text.value = options.text || '加载中...'

    // 全屏模式使用ElLoading服务
    if (options.fullscreen) {
      loadingInstance = ElLoading.service({
        text: options.text || '加载中...',
        background: options.background || 'rgba(0, 0, 0, 0.7)',
        lock: options.lock !== false
      })
    }
  }

  // 隐藏加载状态
  const hide = () => {
    visible.value = false
    if (loadingInstance) {
      loadingInstance.close()
      loadingInstance = null
    }
  }

  return {
    visible,
    text,
    show,
    hide
  }
}

/**
 * 全局加载遮罩管理
 * 直接使用ElLoading.service实现全屏加载效果
 */
export function useGlobalLoading() {
  // 显示全局加载遮罩
  const show = (text?: string) => {
    // 先关闭已有的加载实例
    if (loadingInstance) {
      loadingInstance.close()
    }
    loadingInstance = ElLoading.service({
      text: text || '加载中...',
      background: 'rgba(0, 0, 0, 0.7)',
      lock: true
    })
  }

  // 隐藏全局加载遮罩
  const hide = () => {
    if (loadingInstance) {
      loadingInstance.close()
      loadingInstance = null
    }
  }

  return {
    show,
    hide
  }
}

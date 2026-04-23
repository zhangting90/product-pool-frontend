import { ref } from 'vue'
import { ElLoading } from 'element-plus'
import type { LoadingInstance } from 'element-plus/es/components/loading/src/loading'

interface LoadingOptions {
  text?: string
  background?: string
  fullscreen?: boolean
  lock?: boolean
}

let loadingInstance: LoadingInstance | null = null

export function useLoading() {
  const visible = ref(false)
  const text = ref('')

  const show = (options: LoadingOptions = {}) => {
    visible.value = true
    text.value = options.text || '加载中...'

    if (options.fullscreen) {
      loadingInstance = ElLoading.service({
        text: options.text || '加载中...',
        background: options.background || 'rgba(0, 0, 0, 0.7)',
        lock: options.lock !== false,
      })
    }
  }

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
    hide,
  }
}

export function useGlobalLoading() {
  const show = (text?: string) => {
    if (loadingInstance) {
      loadingInstance.close()
    }
    loadingInstance = ElLoading.service({
      text: text || '加载中...',
      background: 'rgba(0, 0, 0, 0.7)',
      lock: true,
    })
  }

  const hide = () => {
    if (loadingInstance) {
      loadingInstance.close()
      loadingInstance = null
    }
  }

  return {
    show,
    hide,
  }
}

/**
 * Axios 请求封装
 * 基于axios创建统一请求实例，包含请求/响应拦截器、Token注入、错误统一处理
 */
import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'

/** axios请求实例，配置基础URL、超时时间和默认请求头 */
const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: import.meta.env.VITE_API_TIMEOUT ? Number(import.meta.env.VITE_API_TIMEOUT) : 30000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

/** 请求拦截器：自动注入Bearer Token */
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从localStorage获取token并添加到请求头
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

/** 响应拦截器：统一处理业务码和HTTP错误 */
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, message, data } = response.data

    // 业务码为200时返回数据，否则提示错误
    if (code === 200) {
      return data
    } else {
      // 业务错误提示
      ElMessage.error(message || '请求失败')
      return Promise.reject(new Error(message || '请求失败'))
    }
  },
  (error: AxiosError) => {
    // HTTP状态码错误处理
    if (error.response) {
      const { status, data } = error.response
      // 优先使用后端返回的中文错误消息
      const message = data?.message

      switch (status) {
        // 401未授权：提示重新登录
        case 401:
          ElMessageBox.confirm('登录状态已过期，请重新登录', '提示', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            localStorage.removeItem('token')
            window.location.href = '/login'
          })
          break
        // 403禁止访问
        case 403:
          ElMessage.error(message || '没有权限访问')
          break
        // 404资源不存在
        case 404:
          ElMessage.error(message || '请求的资源不存在')
          break
        // 409资源冲突
        case 409:
          ElMessage.error(message || '资源数据冲突')
          break
        // 500服务器内部错误
        case 500:
          ElMessage.error(message || '服务器内部错误')
          break
        default:
          ElMessage.error(message || error.message || '请求失败')
      }
    } else if (error.request) {
      // 请求已发出但未收到响应
      ElMessage.error('网络错误，请检查网络连接')
    } else {
      // 请求配置异常
      ElMessage.error('请求配置错误')
    }

    return Promise.reject(error)
  }
)

export default request

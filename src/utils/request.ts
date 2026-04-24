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

    // 业务码为200时返回数据，否则提示错误并静默拒绝（不再重复弹消息）
    if (code === 200) {
      return data
    } else {
      // 统一弹窗提示后端返回的错误消息
      ElMessage.error(message || '请求失败')
      // reject 一个不带消息的 Error，避免 catch 中重复弹窗
      return Promise.reject(new Error())
    }
  },
  (error: AxiosError) => {
    // HTTP状态码错误处理（网络错误、跨域等非业务异常）
    if (error.response) {
      const { status, data } = error.response
      const message = data?.message
      ElMessage.error(message || '请求失败')
    } else if (error.request) {
      ElMessage.error('网络错误，请检查网络连接')
    } else {
      ElMessage.error('请求配置错误')
    }

    return Promise.reject(new Error())
  }
)

export default request

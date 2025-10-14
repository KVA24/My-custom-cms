import axios, {type AxiosInstance, type AxiosRequestConfig} from "axios"
import {toast} from "react-toastify"
import config from "@/config"
import toastUtil from "@/lib/toastUtil.ts";

export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
}

const AUTH_TOKEN = "wii_token"
const AUTH_REFRESH = "wii_refresh_token"
const AUTH_USER = "wii_user"

class ApiClient {
  private client: AxiosInstance
  private refreshTokenPromise: Promise<string> | null = null
  
  constructor() {
    this.client = axios.create({
      baseURL: config.API_URL || "http://localhost:3000/api",
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
      validateStatus: (status) => status !== 401
    })
    
    this.setupInterceptors()
  }
  
  private setupInterceptors() {
    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(AUTH_TOKEN)
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error),
    )
    
    // Response interceptor - handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config
        
        if ((error.response?.status === 401) && !originalRequest._retry) {
          originalRequest._retry = true
          
          try {
            const newToken = await this.refreshToken()
            originalRequest.headers = originalRequest.headers || {}
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            
            return this.client(originalRequest)
          } catch (refreshError) {
            // Refresh failed, redirect to login
            this.handleAuthFailure()
            return Promise.reject(refreshError)
          }
        }
        
        // Handle other errors
        // this.handleApiError(error)
        return Promise.reject(error)
      },
    )
  }
  
  private async refreshToken(): Promise<string> {
    // Prevent multiple simultaneous refresh requests
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise
    }
    
    this.refreshTokenPromise = this.performTokenRefresh()
    
    try {
      const newToken = await this.refreshTokenPromise
      return newToken
    } finally {
      this.refreshTokenPromise = null
    }
  }
  
  private async performTokenRefresh(): Promise<string> {
    const refreshToken = localStorage.getItem(AUTH_REFRESH)
    
    if (!refreshToken) {
      throw new Error("No refresh token available")
    }
    
    try {
      const response = await axios.post<ApiResponse<RefreshTokenResponse>>(
        `${config.API_URL || "http://localhost:3000/api"}/v1/portal/auth/refresh`,
        {refreshToken},
        {timeout: 5000},
      )
      
      const {accessToken, refreshToken: newRefreshToken} = response.data.data
      
      localStorage.setItem(AUTH_TOKEN, accessToken)
      localStorage.setItem(AUTH_REFRESH, newRefreshToken)
      
      return accessToken
    } catch (error) {
      localStorage.removeItem(AUTH_TOKEN)
      localStorage.removeItem(AUTH_REFRESH)
      throw error
    }
  }
  
  private handleAuthFailure() {
    localStorage.removeItem(AUTH_TOKEN)
    localStorage.removeItem(AUTH_REFRESH)
    localStorage.removeItem(AUTH_USER)
    
    toastUtil.error("Session expired. Please login again.")
    setTimeout(() => {
      window.location.href = "/login"
    }, 2000)
  }
  
  private handleApiError(error: any) {
    if (error.response?.data?.message) {
      toast.error(error.response.data.message)
    } else if (error.message) {
      toast.error(error.message)
    } else {
      toast.error("An unexpected error occurred")
    }
  }
  
  // HTTP Methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, config)
    return this.transformResponse<T>(response)
  }
  
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config)
    return this.transformResponse<T>(response)
  }
  
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config)
    return this.transformResponse<T>(response)
  }
  
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config)
    return this.transformResponse<T>(response)
  }
  
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url, config)
    return this.transformResponse<T>(response)
  }
  
  async upload<T = any>(
    url: string,
    file: File | Blob,
    fieldName = "file",
    extraData?: Record<string, any>,
    config?: AxiosRequestConfig & { onUploadProgress?: (progress: number) => void },
  ): Promise<ApiResponse<T>> {
    const formData = new FormData()
    formData.append(fieldName, file)
    
    if (extraData) {
      Object.entries(extraData).forEach(([key, value]) => {
        formData.append(key, value as any)
      })
    }
    
    const response = await this.client.post<ApiResponse<T>>(url, formData, {
      ...config,
      headers: {
        ...(config?.headers || {}),
        "Content-Type": "multipart/form-data",
      },
    })
    
    return this.transformResponse<T>(response)
  }
  
  async exportFile(
    url: string,
    config?: AxiosRequestConfig,
    fileName?: string,
  ): Promise<void> {
    const response = await this.client.get(url, {
      ...config,
      responseType: "blob",
    })
    
    const contentType = response.headers["content-type"]
    if (contentType?.includes("application/json")) {
      const text = await response.data.text()
      const json = JSON.parse(text)
      this.handleApiError({response: {data: json}})
      return
    }
    
    const contentDisposition = response.headers["content-disposition"]
    let downloadName = fileName || "download_excel"
    
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?([^"]+)"?/)
      if (match?.[1]) {
        downloadName = decodeURIComponent(match[1])
      }
    }
    
    const blob = new Blob([response.data])
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = downloadName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
  }
  
  private transformResponse<T>(response: any): ApiResponse<T> {
    const {status, data} = response
    
    if (status === 200) {
      if (typeof data === "object" && data !== null && "success" in data) {
        return data as ApiResponse<T>
      }
      
      return {
        success: true,
        data: data as T,
        message: "Success",
      }
    }
    
    return {
      success: false,
      data: null as any,
      message: (data && data.message) || `Error: ${status}`,
    }
  }
}

export const apiClient = new ApiClient()
export default apiClient

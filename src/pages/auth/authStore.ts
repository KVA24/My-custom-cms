import {makeAutoObservable} from "mobx"
import {toastUtil} from "@/lib/toastUtil.ts";
import authServices from "@/pages/auth/authService.ts";

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  username?: string
  role?: string
}

export interface LoginCredentials {
  username: string
  password: string
  code?: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface ChangePasswordCredentials {
  oldPassword: string
  newPassword: string
  confirmNewPassword: string
  code?: string
}

class AuthStore {
  user: User | null = null
  isLoading = false
  isLoadingBt = false
  isAuthenticated = false
  isInitialized = false
  dataChangePassword: ChangePasswordCredentials = {
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    code: ""
  }
  errors: any = {};
  
  constructor() {
    makeAutoObservable(this)
  }
  
  clearState = () => {
    this.dataChangePassword = {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      code: ""
    }
    this.errors = {}
  }
  
  async getProfile() {
    this.isInitialized = false
    const profileResponse = await authServices.getProfile()
    this.isInitialized = true
    
    if (profileResponse.success) {
      this.user = profileResponse.data
      this.isAuthenticated = true
      localStorage.setItem("wii_user", JSON.stringify(profileResponse.data))
      return {success: true}
    } else {
      localStorage.removeItem("wii_token")
      localStorage.removeItem("wii_refresh_token")
      localStorage.removeItem("wii_user")
      this.isInitialized = true
      throw new Error("Failed to fetch user profile")
    }
  }
  
  async login(credentials: LoginCredentials, sign?: string) {
    this.isLoading = true
    try {
      const loginResponse = await authServices.login(credentials, sign)
      
      if (loginResponse.success) {
        const {accessToken, refreshToken} = loginResponse.data
        
        localStorage.setItem("wii_token", accessToken)
        localStorage.setItem("wii_refresh_token", refreshToken)
        
        this.getProfile().then()
      } else {
        throw new Error(loginResponse.message || "Login failed")
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Login failed"
      toastUtil.error(errorMessage)
      return {success: false, error: errorMessage}
    } finally {
      this.isLoading = false
    }
  }
  
  async changePassword(sign?: any) {
    const data = this.dataChangePassword
    this.isLoadingBt = true
    try {
      const loginResponse = await authServices.changePassword(data, sign)
      if (loginResponse.success) {
        toastUtil.success("Change password success")
      } else {
        throw new Error(loginResponse.message || "Failed")
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Login failed"
      toastUtil.error(errorMessage)
      return {success: false, error: errorMessage}
    } finally {
      this.isLoadingBt = false
    }
  }
  
  async register(credentials: RegisterCredentials) {
    return credentials
  }
  
  logout() {
    this.user = null
    this.isAuthenticated = false
    this.isInitialized = true
    localStorage.removeItem("wii_token")
    localStorage.removeItem("wii_refresh_token")
    localStorage.removeItem("user_data")
  }
}

const authStore = new AuthStore()
export const useAuthStore = () => authStore

export {AuthStore}
export default authStore

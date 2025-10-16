import apiClient, {type ApiResponse} from "../../lib/api.ts"
import type {ChangePasswordCredentials, LoginCredentials, User} from "./authStore.ts"

export interface LoginResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface RegisterResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export class AuthService {
  async login(credentials: LoginCredentials, sign?: any): Promise<ApiResponse<LoginResponse>> {
    const path = `/v1/portal/auth/login?sign=${sign ? sign : ''}`
    return apiClient.post<LoginResponse>(path, credentials)
  }
  
  async getProfile(): Promise<ApiResponse<User>> {
    const path = "/v1/portal/account/profile"
    return apiClient.get<User>(path)
  }
  
  async changePassword(data: ChangePasswordCredentials, sign?: any): Promise<ApiResponse> {
    const path = `/v1/portal/account/changePassword?sign=${sign ? sign : ''}`
    return apiClient.put<ChangePasswordCredentials>(path, data)
  }
  
  async logout(): Promise<ApiResponse> {
    const path = "/v1/portal/auth/logout"
    return apiClient.post<LoginResponse>(path, {})
  }
}

export const authService = new AuthService()
export default authService

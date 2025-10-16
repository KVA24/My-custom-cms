import apiClient, {type ApiResponse} from "../../lib/api.ts"
import {DataRequest} from "@/pages/configs/configStore.ts";
import accountStore from "./accountStore.ts";

export class AccountService {
  async getList(): Promise<ApiResponse> {
    const path = `/v1/account?page=${accountStore.page}&size=${accountStore.size}${accountStore.searchKey ? `&username=${encodeURIComponent(accountStore.searchKey)}` : ''}`
    return apiClient.get(path)
  }
  
  async getDetail(id: string): Promise<ApiResponse> {
    const path = `/v1/account/${id}`
    return apiClient.get(path)
  }
  
  async create(data: any, sign?: any): Promise<ApiResponse> {
    const path = `/v1/account?sign=${sign ? sign : ''}`
    return apiClient.post<DataRequest>(path, data)
  }
  
  async update(id: string, data: any, sign?: any): Promise<ApiResponse> {
    const path = `/v1/account/${id}?sign=${sign ? sign : ''}`
    return apiClient.put<DataRequest>(path, data)
  }
  
  async delete(id: string, sign?: any, otpCode?: any): Promise<ApiResponse> {
    const path = `/v1/account/${id}?sign=${sign ? sign : ''}&otpCode=${otpCode ? otpCode : ''}`
    return apiClient.delete<DataRequest>(path, {})
  }
  
  async genQr(id: string): Promise<ApiResponse> {
    const path = `/v1/account/2fa/qrcode/${id}`
    return apiClient.get(path)
  }
  
}

export const accountService = new AccountService()
export default accountService

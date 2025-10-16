import apiClient, {type ApiResponse} from "../../lib/api.ts"
import configStore, {DataRequest} from "./configStore.ts";

export class ConfigService {
  async getList(): Promise<ApiResponse> {
    const path = `/v1/configs?page=${configStore.page}&size=${configStore.size}${configStore.searchKey ? `&searchKey=${encodeURIComponent(configStore.searchKey)}` : ''}`
    return apiClient.get(path)
  }
  
  async getDetail(id: string): Promise<ApiResponse> {
    const path = `/v1/configs/${id}`
    return apiClient.get(path)
  }
  
  async create(data: any, sign?: any): Promise<ApiResponse> {
    const path = `/v1/configs?sign=${sign ? sign : ''}`
    return apiClient.post<DataRequest>(path, data)
  }
  
  async update(id: string, data: any, sign?: any): Promise<ApiResponse> {
    const path = `/v1/configs/${id}?sign=${sign ? sign : ''}`
    return apiClient.put<DataRequest>(path, data)
  }
  
  async delete(id: string, sign?: any, otpCode?: any): Promise<ApiResponse> {
    const path = `/v1/configs/${id}?sign=${sign ? sign : ''}&otpCode=${otpCode ? otpCode : ''}`
    return apiClient.delete<DataRequest>(path, {})
  }
  
}

export const configService = new ConfigService()
export default configService

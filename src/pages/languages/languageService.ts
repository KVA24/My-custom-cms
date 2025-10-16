import apiClient, {type ApiResponse} from "../../lib/api.ts"
import {DataRequest} from "@/pages/configs/configStore.ts";
import languageStore from "./languageStore.ts";

export class LanguageService {
  async getList(): Promise<ApiResponse> {
    const path = `/v1/portal/language?page=${languageStore.page}&size=${languageStore.size}${languageStore.searchKey ? `&username=${encodeURIComponent(languageStore.searchKey)}` : ''}`
    return apiClient.get(path)
  }
  
  async getAll(): Promise<ApiResponse> {
    const path = `/v1/portal/language/all`
    return apiClient.get(path)
  }
  
  async getDetail(id: string): Promise<ApiResponse> {
    const path = `/v1/portal/language/${id}`
    return apiClient.get(path)
  }
  
  async create(data: any): Promise<ApiResponse> {
    const path = `/v1/portal/language`
    return apiClient.post<DataRequest>(path, data)
  }
  
  async update(id: string | undefined, data: any): Promise<ApiResponse> {
    const path = `/v1/portal/language/${id}`
    return apiClient.put<DataRequest>(path, data)
  }
  
  async delete(id: string): Promise<ApiResponse> {
    const path = `/v1/portal/language/${id}`
    return apiClient.delete<DataRequest>(path, {})
  }
}

export const languageService = new LanguageService()
export default languageService

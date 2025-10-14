import apiClient, {type ApiResponse} from "../../lib/api.ts"
import {DataRequest} from "@/pages/configs/configStore.ts";
import itemStore from "./itemStore.ts";

export class ItemService {
  async getList(): Promise<ApiResponse> {
    const path = `/v1/portal/store-items?page=${itemStore.page}&size=${itemStore.size}${itemStore.searchKey ? `&username=${encodeURIComponent(itemStore.searchKey)}` : ''}`
    return apiClient.get(path)
  }
  
  async getDetail(id: string | undefined): Promise<ApiResponse> {
    const path = `/v1/portal/store-items/detail/${id}`
    return apiClient.get(path)
  }
  
  async getListItems(): Promise<ApiResponse> {
    const path = `/v1/portal/items/all`
    return apiClient.get(path)
  }
  
  async getListBudget(): Promise<ApiResponse> {
    const path = `/v1/portal/pool-budget/all`
    return apiClient.get(path)
  }
  
  async create(data: any): Promise<ApiResponse> {
    const path = `/v1/portal/store-items`
    return apiClient.post<DataRequest>(path, data)
  }
  
  async update(id: string | undefined, data: any): Promise<ApiResponse> {
    const path = `/v1/portal/store-items/${id}`
    return apiClient.put<DataRequest>(path, data)
  }
  
  async delete(id: string): Promise<ApiResponse> {
    const path = `/v1/portal/store-items/${id}`
    return apiClient.delete<DataRequest>(path, {})
  }
}

export const itemService = new ItemService()
export default itemService

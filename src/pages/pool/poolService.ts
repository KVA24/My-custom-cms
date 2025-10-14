import apiClient, {type ApiResponse} from "../../lib/api.ts"
import {DataRequest} from "@/pages/configs/configStore.ts";
import poolStore from "./poolStore.ts";

export class PoolService {
  async getList(): Promise<ApiResponse> {
    const path = `/v1/portal/pools?page=${poolStore.page}&size=${poolStore.size}${poolStore.searchKey ? `&username=${encodeURIComponent(poolStore.searchKey)}` : ''}`
    return apiClient.get(path)
  }
  
  async getDetail(id: string | undefined): Promise<ApiResponse> {
    const path = `/v1/portal/pools/${id}`
    return apiClient.get(path)
  }
  
  async getListRewards(): Promise<ApiResponse> {
    const path = `/v1/portal/rewards/all`
    return apiClient.get(path)
  }
  
  async getListBudget(): Promise<ApiResponse> {
    const path = `/v1/portal/pool-budget/all`
    return apiClient.get(path)
  }
  
  async getListFallbackPool(): Promise<ApiResponse> {
    const path = `/v1/portal/pools/all`
    return apiClient.get(path)
  }
  
  async create(data: any): Promise<ApiResponse> {
    const path = `/v1/portal/pools`
    return apiClient.post<DataRequest>(path, data)
  }
  
  async update(id: string | undefined, data: any): Promise<ApiResponse> {
    const path = `/v1/portal/pools/${id}`
    return apiClient.put<DataRequest>(path, data)
  }
  
  async delete(id: string): Promise<ApiResponse> {
    const path = `/v1/portal/pools/${id}`
    return apiClient.delete<DataRequest>(path, {})
  }
}

export const poolService = new PoolService()
export default poolService

import apiClient, {type ApiResponse} from "../../lib/api.ts"
import {DataRequest} from "@/pages/configs/configStore.ts";
import rewardStore from "./rewardStore.ts";

export class RewardService {
  async getList(): Promise<ApiResponse> {
    const path = `/v1/portal/rewards?page=${rewardStore.page}&size=${rewardStore.size}${rewardStore.searchKey ? `&search=${encodeURIComponent(rewardStore.searchKey)}` : ''}`
    return apiClient.get(path)
  }
  
  async getDetail(id: string | undefined): Promise<ApiResponse> {
    const path = `/v1/portal/rewards/${id}`
    return apiClient.get(path)
  }
  
  async getListItems(): Promise<ApiResponse> {
    const path = `/v1/portal/items/all`
    return apiClient.get(path)
  }
  
  async create(data: any): Promise<ApiResponse> {
    const path = `/v1/portal/rewards`
    return apiClient.post<DataRequest>(path, data)
  }
  
  async update(id: string | undefined, data: any): Promise<ApiResponse> {
    const path = `/v1/portal/rewards/${id}`
    return apiClient.put<DataRequest>(path, data)
  }
  
  async delete(id: string): Promise<ApiResponse> {
    const path = `/v1/portal/rewards/${id}`
    return apiClient.delete<DataRequest>(path, {})
  }
}

export const rewardService = new RewardService()
export default rewardService

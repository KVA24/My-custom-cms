import apiClient, {type ApiResponse} from "../../lib/api.ts"
import {DataRequest} from "@/pages/configs/configStore.ts";
import budgetStore from "./budgetStore.ts";

export class BudgetService {
  async getList(): Promise<ApiResponse> {
    const path = `/v1/portal/pool-budget?page=${budgetStore.page}&size=${budgetStore.size}${budgetStore.searchKey ? `&username=${encodeURIComponent(budgetStore.searchKey)}` : ''}`
    return apiClient.get(path)
  }
  
  async getDetail(id: string | undefined): Promise<ApiResponse> {
    const path = `/v1/portal/pool-budget/${id}`
    return apiClient.get(path)
  }
  
  async create(data: any): Promise<ApiResponse> {
    const path = `/v1/portal/pool-budget`
    return apiClient.post<DataRequest>(path, data)
  }
  
  async update(id: string | undefined, data: any): Promise<ApiResponse> {
    const path = `/v1/portal/pool-budget/${id}`
    return apiClient.put<DataRequest>(path, data)
  }
  
  async updateAmount(id: string | undefined, data: any): Promise<ApiResponse> {
    const path = `/v1/portal/pool-budget/${id}/transact`
    return apiClient.post<DataRequest>(path, {...data, id: id})
  }
  
  async delete(id: string): Promise<ApiResponse> {
    const path = `/v1/portal/pool-budget/${id}`
    return apiClient.delete<DataRequest>(path, {})
  }
}

export const budgetService = new BudgetService()
export default budgetService

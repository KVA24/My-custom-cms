import apiClient, {type ApiResponse} from "../../lib/api.ts"
import {DataRequest} from "@/pages/configs/configStore.ts";
import taskStore from "./taskStore.ts";

export class TaskService {
  async getList(): Promise<ApiResponse> {
    const path = `/v1/portal/task?page=${taskStore.page}&size=${taskStore.size}${taskStore.searchKey ? `&username=${encodeURIComponent(taskStore.searchKey)}` : ''}`
    return apiClient.get(path)
  }
  
  async getDetail(id: string | undefined): Promise<ApiResponse> {
    const path = `/v1/portal/task/${id}`
    return apiClient.get(path)
  }
  
  async getAllEvent(): Promise<ApiResponse> {
    const path = `/v1/portal/event/all`
    return apiClient.get(path)
  }
  
  async getPeriodUnit(): Promise<ApiResponse> {
    const path = `/v1/portal/task/period-units`
    return apiClient.get(path)
  }
  
  async getQuestPeriodUnit(): Promise<ApiResponse> {
    const path = `/v1/portal/task/quest/period-units`
    return apiClient.get(path)
  }
  
  async getSlidingType(): Promise<ApiResponse> {
    const path = `/v1/portal/task/slidingType?unit=${taskStore.dataRequest.periodUnit}`
    return apiClient.get(path)
  }
  
  async getTaskCategory(): Promise<ApiResponse> {
    const path = `/v1/portal/task/task-category`
    return apiClient.get(path)
  }
  
  async create(data: any): Promise<ApiResponse> {
    const path = `/v1/portal/task`
    return apiClient.post<DataRequest>(path, data)
  }
  
  async update(id: string | undefined, data: any): Promise<ApiResponse> {
    const path = `/v1/portal/task/${id}`
    return apiClient.put<DataRequest>(path, data)
  }
  
  async updateState(id: string | undefined, status: string): Promise<ApiResponse> {
    const path = `/v1/portal/task/${id}/status`
    return apiClient.put<DataRequest>(path, {state: status, otpCode: taskStore.otpCode})
  }
  
  async delete(id: string): Promise<ApiResponse> {
    const path = `/v1/portal/task/${id}`
    return apiClient.delete<DataRequest>(path, {})
  }
}

export const taskService = new TaskService()
export default taskService

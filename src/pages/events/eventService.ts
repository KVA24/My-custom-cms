import apiClient, {type ApiResponse} from "../../lib/api.ts"
import {DataRequest} from "@/pages/configs/configStore.ts";
import eventStore from "./eventStore.ts";

export class EventService {
  async getList(): Promise<ApiResponse> {
    const path = `/v1/portal/event?page=${eventStore.page}&size=${eventStore.size}${eventStore.searchKey ? `&username=${encodeURIComponent(eventStore.searchKey)}` : ''}`
    return apiClient.get(path)
  }
  
  async getDetail(id: string | undefined): Promise<ApiResponse> {
    const path = `/v1/portal/event/${id}`
    return apiClient.get(path)
  }
  
  async getDataType(): Promise<ApiResponse> {
    const path = `/v1/portal/event/data-type`
    return apiClient.get(path)
  }
  
  async getOperator(): Promise<ApiResponse> {
    const path = `/v1/portal/event/operator`
    return apiClient.get(path)
  }
  
  async create(data: any): Promise<ApiResponse> {
    const path = `/v1/portal/event`
    return apiClient.post<DataRequest>(path, data)
  }
  
  async update(id: string | undefined, data: any): Promise<ApiResponse> {
    const path = `/v1/portal/event/${id}`
    return apiClient.put<DataRequest>(path, data)
  }
  
  async delete(id: string): Promise<ApiResponse> {
    const path = `/v1/portal/event/${id}`
    return apiClient.delete<DataRequest>(path, {})
  }
}

export const eventService = new EventService()
export default eventService

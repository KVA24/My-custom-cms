import apiClient, {type ApiResponse} from "../../lib/api.ts"
import {DataRequest} from "@/pages/configs/configStore.ts";
import quizStore from "./quizStore.ts";
import languageStore from "@/pages/languages/languageStore.ts";

export class QuizService {
  async getList(): Promise<ApiResponse> {
    const path = `/v1/portal/quiz?page=${quizStore.page}&size=${quizStore.size}${quizStore.searchKey ? `&username=${encodeURIComponent(quizStore.searchKey)}` : ''}`
    return apiClient.get(path)
  }
  
  async getDetail(id: string): Promise<ApiResponse> {
    const path = `/v1/portal/quiz/${id}?languageId=${languageStore.languageId}`
    return apiClient.get(path)
  }
  
  async create(data: any): Promise<ApiResponse> {
    const path = `/v1/portal/quiz?languageId=${languageStore.languageId}`
    return apiClient.post<DataRequest>(path, data)
  }
  
  async update(id: string | undefined, data: any): Promise<ApiResponse> {
    const path = `/v1/portal/quiz/${id}?languageId=${languageStore.languageId}`
    return apiClient.put<DataRequest>(path, data)
  }
  
  async delete(id: string): Promise<ApiResponse> {
    const path = `/v1/portal/quiz/${id}`
    return apiClient.delete<DataRequest>(path, {})
  }
}

export const quizService = new QuizService()
export default quizService

import apiClient, {type ApiResponse} from "../../lib/api.ts"
import logStore from "./logStore.ts";
import {format} from "date-fns";

export class LogService {
  async getList(): Promise<ApiResponse> {
    const path = `/v1/action-log?page=${logStore.page}&limit=${logStore.size}${logStore.searchKey ? `&username=${encodeURIComponent(logStore.searchKey)}` : ''}${
      logStore.next ? `&next=${logStore.next}` : ''
    }${logStore.previous ? `&pre=${logStore.previous}` : ''}${logStore.searchRole ? `&accountRole=${logStore.searchRole}` : ''}${
      logStore.searchType ? `&actionType=${logStore.searchType}` : ''
    }${logStore.gte ? `&gte=${format(logStore.gte, "yyyy-MM-dd")}` : ''}${logStore.lte ? `&lte=${format(logStore.lte, "yyyy-MM-dd")}` : ''}`
    return apiClient.get(path)
  }
}

export const logService = new LogService()
export default logService

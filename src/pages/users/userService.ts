import apiClient, {type ApiResponse} from "../../lib/api.ts"
import userStore from "./userStore";
import {format} from "date-fns";

export class UserService {
  async getList(): Promise<ApiResponse> {
    const path = `/v1/portal/user?page=${userStore.page}&size=${userStore.size}${userStore.searchKey ? `&username=${encodeURIComponent(userStore.searchKey)}` : ''}`
    return apiClient.get(path)
  }
  
  async getDetail(id: string | undefined): Promise<ApiResponse> {
    const path = `/v1/portal/user/${id}`
    return apiClient.get(path)
  }
  
  async getTransaction(userId: string | undefined): Promise<ApiResponse> {
    const path = `/v1/portal/user/transaction?userId=${userId}&limit=${userStore.size}${
      userStore.next ? `&next=${userStore.next}` : ''
    }${userStore.previous ? `&pre=${userStore.previous}` : ''}${
      userStore.searchKey ? `&searchKey=${encodeURIComponent(userStore.searchKey)}` : ''
    }${userStore.typeTransaction ? `&transactionSourceType=${userStore.typeTransaction}` : ''}${
      userStore.searchId ? `&transId=${userStore.searchId}` : ''
    }${userStore.action ? `&action=${userStore.action}` : ''}${
      userStore.searchItem ? `&itemId=${userStore.searchItem}` : ''
    }${userStore.gte ? `&gte=${format(userStore.gte, "yyyy-MM-dd")}` : ''}${userStore.lte ? `&lte=${format(userStore.lte, "yyyy-MM-dd")}` : ''}`
    return apiClient.get(path)
  }
  
  async getItemList(): Promise<ApiResponse> {
    const path = `/v1/portal/items/all`
    return apiClient.get(path)
  }
}

export const userService = new UserService()
export default userService

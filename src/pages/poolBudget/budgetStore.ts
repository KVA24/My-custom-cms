import {makeAutoObservable} from "mobx"
import budgetService from "./budgetService.ts";
import toastUtil from "@/lib/toastUtil.ts";

export interface DataList {
  id: string;
  name: string
  value: number
  createdAt: string
  updatedAt: string
}

export interface DataRequest {
  id: string
  name: string
  value: number
}

export interface DataRequestChange {
  id: string
  amount: number
  action: string
}

class BudgetStore {
  isLoading: boolean = false
  isLoadingGet: boolean = false
  isLoadingBt: boolean = false
  isOk: boolean = false
  page: number = 0
  size: number = 10
  totalPages: number = 0
  searchKey: string = ""
  id: string = ""
  errors: any = []
  lists: DataList[] = []
  dataRequest: DataRequest = {
    id: "",
    name: "",
    value: 0,
  }
  dataRequestChange: DataRequestChange = {
    id: "",
    amount: 0,
    action: "",
  }
  
  constructor() {
    makeAutoObservable(this)
  }
  
  clearState = () => {
    this.dataRequest = {
      id: "",
      name: "",
      value: 0,
    }
    this.dataRequestChange = {
      id: "",
      amount: 0,
      action: "",
    }
    this.errors = []
  }
  
  private async handleRequest(
    fn: () => Promise<any>,
    successMessage: string,
    refreshList: boolean = false
  ): Promise<any> {
    this.isOk = false;
    this.isLoadingBt = true;
    try {
      const response = await fn();
      if (response.success) {
        toastUtil.success(successMessage);
        this.isOk = true;
        if (refreshList) {
          this.getList().then();
        }
        return response;
      } else {
        throw new Error(response.message || successMessage + " failed");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Unexpected error";
      toastUtil.error(errorMessage);
      return {success: false, error: errorMessage};
    } finally {
      this.isLoadingBt = false;
    }
  }
  
  getList = async () => {
    this.isLoading = true
    const response = await budgetService.getList()
    this.isLoading = false
    
    if (response.success) {
      this.lists = response.data.data
      this.totalPages = response.data.metadata.totalPages
    } else {
      toastUtil.error(response.message || "Failed to fetch")
    }
  }
  
  getDetail = async (id: string | undefined) => {
    this.clearState()
    this.isLoadingGet = true
    const response = await budgetService.getDetail(id)
    this.isLoadingGet = false
    
    if (response.success) {
      this.dataRequest = response.data
    } else {
      toastUtil.error(response.message || "Failed to fetch")
    }
  }
  
  create = async () => {
    await this.handleRequest(() => budgetService.create(this.dataRequest), "Created", true);
  }
  
  update = async () => {
    await this.handleRequest(() => budgetService.update(this.dataRequest.id, this.dataRequest), "Updated", true);
  }
  
  updateAmount = async () => {
    await this.handleRequest(() => budgetService.updateAmount(this.id, this.dataRequestChange), "Updated", true);
  }
  
  delete = async () =>
    this.handleRequest(() => budgetService.delete(this.id), "Deleted", true);
}

const budgetStore = new BudgetStore()
export const useAuthStore = () => budgetStore

export {BudgetStore}
export default budgetStore

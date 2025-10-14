import {makeAutoObservable} from "mobx"
import configService from "./configService.ts";
import toastUtil from "@/lib/toastUtil.ts";

export interface DataRequest {
  id: string
  keyConfig: string
  valueConfig: string
  otpCode: string
}

class ConfigStore {
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
  configs: DataRequest[] = []
  dataRequest: DataRequest = {
    id: "",
    keyConfig: "",
    valueConfig: "",
    otpCode: ""
  }
  otpCode: string = ""
  
  constructor() {
    makeAutoObservable(this)
  }
  
  clearState = () => {
    this.dataRequest = {
      id: "",
      keyConfig: "",
      valueConfig: "",
      otpCode: ""
    }
    this.errors = []
    this.otpCode = ""
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
    const response = await configService.getList()
    this.isLoading = false
    
    if (response.success) {
      this.configs = response.data.data
      this.totalPages = response.data.metadata.totalPages
    } else {
      toastUtil.error(response.message || "Failed to fetch")
    }
  }
  
  getDetail = async (id: string) => {
    this.clearState()
    this.isLoadingGet = true
    const response = await configService.getDetail(id)
    this.isLoadingGet = false
    
    if (response.success) {
      this.dataRequest = response.data
    } else {
      toastUtil.error(response.message || "Failed to fetch")
    }
  }
  
  create = async (sign?: any) => {
    await this.handleRequest(() => configService.create(this.dataRequest, sign), "Created", true);
  }
  
  update = async (sign?: any) => {
    await this.handleRequest(() => configService.update(this.dataRequest.id, this.dataRequest, sign), "Updated", true);
  }
  
  delete = async (sign?: any) =>
    this.handleRequest(() => configService.delete(this.id, sign, this.otpCode), "Deleted", true);
}

const configStore = new ConfigStore()
export const useAuthStore = () => configStore

export {ConfigStore}
export default configStore

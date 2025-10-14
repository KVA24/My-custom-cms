import {makeAutoObservable} from "mobx"
import itemService from "./itemService.ts";
import toastUtil from "@/lib/toastUtil.ts";

type PackageType =
  | "DIAMOND"
  | "TURN_FREE"
  | "TURN_PAID"
  | "HAMMER"
  | "MIX"
  | "MB"
  | "JACKFRUIT"
  | "POINT"
  | "JACKPOT";

type SourceType = "EXTERNAL" | "GAME";

export interface DataRequest {
  id: string;
  code: string;
  name: string;
  type: string | PackageType;
  sourceType: string | SourceType;
  convertRate: number;
}

class ItemStore {
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
  lists: DataRequest[] = []
  dataRequest: DataRequest = {
    id: '',
    code: '',
    name: '',
    type: '',
    sourceType: '',
    convertRate: 0,
  }
  listType: string[] = ["DIAMOND", "TURN_FREE", "TURN_PAID", "HAMMER", "MIX", "MB", "JACKFRUIT", "POINT", "JACKPOT"]
  listSourceType: string[] = ["EXTERNAL", "GAME"]
  
  constructor() {
    makeAutoObservable(this)
  }
  
  clearState = () => {
    this.dataRequest = {
      id: '',
      code: '',
      name: '',
      type: '',
      sourceType: '',
      convertRate: 0,
    }
    this.errors = []
    this.searchKey = ""
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
    const response = await itemService.getList()
    this.isLoading = false
    
    if (response.success) {
      this.lists = response.data.data
      this.totalPages = response.data.metadata.totalPages
    } else {
      toastUtil.error(response.message || "Failed to fetch")
    }
  }
  
  getDetail = async (id: string) => {
    this.clearState()
    this.isLoadingGet = true
    const response = await itemService.getDetail(id)
    this.isLoadingGet = false
    
    if (response.success) {
      this.dataRequest = response.data
    } else {
      toastUtil.error(response.message || "Failed to fetch")
    }
  }
  
  create = async () => {
    await this.handleRequest(() => itemService.create(this.dataRequest), "Created", true);
  }
  
  update = async () => {
    await this.handleRequest(() => itemService.update(this.dataRequest.id, this.dataRequest), "Updated", true);
  }
  
  delete = async () =>
    this.handleRequest(() => itemService.delete(this.id), "Deleted", true);
}

const itemStore = new ItemStore()
export const useItemStore = () => itemStore

export {ItemStore}
export default itemStore

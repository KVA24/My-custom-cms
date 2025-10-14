import {makeAutoObservable} from "mobx"
import itemService from "./itemService.ts";
import toastUtil from "@/lib/toastUtil.ts";

type Type =
  | "DIAMOND"
  | "KS"

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
type RegType = "SUB" | "CHARGE";

export interface Item {
  id: string;
  code: string;
  name: string;
  itemName: string
  itemCode: string
  type: string | PackageType;
  sourceType: string | SourceType;
  convertRate: number;
  itemId: string
  quantity: number
  unitPrice: number
  displayOrder: number
}

export interface DataRequest {
  id: string;
  serviceId: string;
  name: string;
  type: string | Type;
  price: number;
  convertedPrice: number;
  items: Item[]
  state: string
  poolBudgetId: string
  regType: string | RegType
  displayOrder: number
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
    serviceId: '',
    name: '',
    type: '',
    price: 0,
    convertedPrice: 0,
    items: [],
    state: '',
    poolBudgetId: '',
    regType: '',
    displayOrder: 0
  }
  listType: string[] = ["DIAMOND", "KS"]
  listItems: any = []
  listBudgets: any = []
  listRegType: string[] = ["SUB", "CHARGE"]
  listItemsSelected: any = []
  
  constructor() {
    makeAutoObservable(this)
  }
  
  clearState = () => {
    this.dataRequest = {
      id: '',
      serviceId: '',
      name: '',
      type: '',
      price: 0,
      convertedPrice: 0,
      items: [],
      state: '',
      poolBudgetId: '',
      regType: '',
      displayOrder: 0
    }
    this.errors = []
    this.listItemsSelected = []
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
        } else {
          setTimeout(() => {
            window.location.href = "/cms/item-store";
          }, 1000)
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
  
  getDetail = async (id: string | undefined) => {
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
  
  getListItems = async () => {
    this.isLoadingGet = true
    const response = await itemService.getListItems()
    this.isLoadingGet = false
    
    if (response.success) {
      this.listItems = response.data
    } else {
      toastUtil.error(response.message || "Failed to fetch")
    }
  }
  
  getListBudget = async () => {
    this.isLoadingGet = true
    const response = await itemService.getListBudget()
    this.isLoadingGet = false
    
    if (response.success) {
      this.listBudgets = response.data
    } else {
      toastUtil.error(response.message || "Failed to fetch")
    }
  }
  
  create = async () => {
    await this.handleRequest(() => itemService.create(this.dataRequest), "Created", false);
  }
  
  update = async () => {
    await this.handleRequest(() => itemService.update(this.dataRequest.id, this.dataRequest), "Updated", false);
  }
  
  delete = async () =>
    this.handleRequest(() => itemService.delete(this.id), "Deleted", true);
}

const itemStore = new ItemStore()
export const useAuthStore = () => itemStore

export {ItemStore}
export default itemStore

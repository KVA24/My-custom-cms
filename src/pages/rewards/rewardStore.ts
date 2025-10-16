import {makeAutoObservable} from "mobx"
import rewardService from "./rewardService.ts";
import toastUtil from "@/lib/toastUtil.ts";

type Type =
  | "DIAMOND"
  | "HAMMER"
  | "MIX"
  | "MB"
  | "POINT"
  | "JACKFRUIT"

export interface DataList {
  id: string;
  rewardName: string;
  itemName: string;
  value: number
  valueConverted: number
  type: string | Type;
  imageUrl: string
  imageId: string
  externalId: string
  isDefault: boolean
  itemId: string
  itemCode: string
}

export interface DataRequest {
  id: string;
  rewardName: string;
  value: number
  valueConverted: number
  type: string | Type;
  imageUrl: string
  imageId: string
  externalId: string
  isDefault: boolean
  itemId: string
  itemCode: string
}

class RewardStore {
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
    rewardName: "",
    value: 0,
    valueConverted: 0,
    type: "",
    imageUrl: "",
    imageId: "",
    externalId: "",
    isDefault: false,
    itemId: "",
    itemCode: ""
  }
  listType: string[] = ["POINT", "TURN", "BONUS_MILES"]
  listItems: any = []
  listItemsSelected: any = []
  
  constructor() {
    makeAutoObservable(this)
  }
  
  clearState = () => {
    this.dataRequest = {
      id: "",
      rewardName: "",
      value: 0,
      valueConverted: 0,
      type: "",
      imageUrl: "",
      imageId: "",
      externalId: "",
      isDefault: false,
      itemId: "",
      itemCode: ""
    }
    this.errors = []
    this.listItemsSelected = []
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
    const response = await rewardService.getList()
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
    const response = await rewardService.getDetail(id)
    this.isLoadingGet = false
    
    if (response.success) {
      this.dataRequest = response.data
    } else {
      toastUtil.error(response.message || "Failed to fetch")
    }
  }
  
  getListItems = async () => {
    this.isLoadingGet = true
    const response = await rewardService.getListItems()
    this.isLoadingGet = false
    
    if (response.success) {
      this.listItems = response.data
    } else {
      toastUtil.error(response.message || "Failed to fetch")
    }
  }
  
  create = async () => {
    await this.handleRequest(() => rewardService.create(this.dataRequest), "Created", true);
  }
  
  update = async () => {
    await this.handleRequest(() => rewardService.update(this.dataRequest.id, this.dataRequest), "Updated", true);
  }
  
  delete = async () =>
    this.handleRequest(() => rewardService.delete(this.id), "Deleted", true);
}

const rewardStore = new RewardStore()
export const useRewardStore = () => rewardStore

export {RewardStore}
export default rewardStore

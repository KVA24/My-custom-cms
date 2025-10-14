import {makeAutoObservable} from "mobx"
import poolService from "./poolService.ts";
import toastUtil from "@/lib/toastUtil.ts";
import {format} from "date-fns";

export interface DataList {
  id: string;
  code: string;
  fallbackPoolId: string;
  state: string;
  rewardMaps: RewardMap[]
  version: number
}

export interface Schedule {
  poolRewardMapId: string;
  periodType: string;
  quantity: number;
  startAt: Date | undefined;
  endAt: Date | undefined;
  state: string
}

export interface RewardMap {
  id: string;
  rewardId: string;
  rewardName: string;
  weight: number;
  periodType: string
  isActivate: boolean;
  isUnlimited: boolean;
  poolRewardSchedules: Schedule[]
}

export interface DataRequest {
  id: string;
  code: string;
  fallbackPoolId: string;
  state: string;
  rewardMaps: RewardMap[];
  poolBudgetId: string;
}

class PoolStore {
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
    id: '',
    code: '',
    fallbackPoolId: '',
    state: '',
    rewardMaps: [],
    poolBudgetId: ''
  }
  periodTypes: string[] = ["ALL_THE_TIME", "UNLIMITED", "DAY", "WEEK", "MONTH"]
  periodTypeSchedule: string[] = ["MINUTE", "HOUR", "DAY"]
  listRewards: any = []
  listBudgets: any = []
  listFallbackPools: any = []
  listRewardsSelected: any = []
  
  constructor() {
    makeAutoObservable(this)
  }
  
  clearState = () => {
    this.dataRequest = {
      id: '',
      code: '',
      fallbackPoolId: '',
      state: '',
      rewardMaps: [],
      poolBudgetId: ''
    }
    this.errors = []
    this.listRewardsSelected = []
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
            window.location.href = "/cms/pool";
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
    const response = await poolService.getList()
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
    const response = await poolService.getDetail(id)
    this.isLoadingGet = false
    
    if (response.success) {
      this.dataRequest = response.data
      this.dataRequest = {
        ...this.dataRequest,
        rewardMaps: this.dataRequest.rewardMaps.map(reward => ({
          ...reward,
          poolRewardSchedules: reward.poolRewardSchedules ? reward.poolRewardSchedules.map(sch => ({
            ...sch,
            startAt: sch.startAt && new Date(sch.startAt),
            endAt: sch.endAt && new Date(sch.endAt),
          })) : []
        }))
      }
    } else {
      toastUtil.error(response.message || "Failed to fetch")
    }
  }
  
  getListRewards = async () => {
    this.isLoadingGet = true
    const response = await poolService.getListRewards()
    this.isLoadingGet = false
    
    if (response.success) {
      this.listRewards = response.data
    } else {
      toastUtil.error(response.message || "Failed to fetch")
    }
  }
  
  getListBudget = async () => {
    this.isLoadingGet = true
    const response = await poolService.getListBudget()
    this.isLoadingGet = false
    
    if (response.success) {
      this.listBudgets = response.data
    } else {
      toastUtil.error(response.message || "Failed to fetch")
    }
  }
  
  getListFallbackPool = async () => {
    this.isLoadingGet = true
    const response = await poolService.getListFallbackPool()
    this.isLoadingGet = false
    
    if (response.success) {
      this.listFallbackPools = response.data
    } else {
      toastUtil.error(response.message || "Failed to fetch")
    }
  }
  
  create = async () => {
    const data: DataRequest | null = this.dataRequest
    
    const formattedData = {
      ...data,
      rewardMaps: data.rewardMaps.map(reward => ({
        ...reward,
        poolRewardSchedules: reward.poolRewardSchedules.map(sch => ({
          ...sch,
          startAt: sch.startAt && format(sch.startAt, "yyyy-MM-dd HH:mm"),
          endAt: sch.endAt && format(sch.endAt, "yyyy-MM-dd HH:mm"),
        }))
      }))
    }
    await this.handleRequest(() => poolService.create(formattedData), "Created", false);
  }
  
  update = async () => {
    const data: DataRequest | null = this.dataRequest
    
    const formattedData = {
      ...data,
      rewardMaps: data.rewardMaps.map(reward => ({
        ...reward,
        poolRewardSchedules: reward.poolRewardSchedules.map(sch => ({
          ...sch,
          startAt: sch.startAt && format(sch.startAt, "yyyy-MM-dd HH:mm"),
          endAt: sch.endAt && format(sch.endAt, "yyyy-MM-dd HH:mm"),
        }))
      }))
    }
    await this.handleRequest(() => poolService.update(data.id, formattedData), "Updated", false);
  }
  
  delete = async () =>
    this.handleRequest(() => poolService.delete(this.id), "Deleted", true);
}

const poolStore = new PoolStore()
export const useAuthStore = () => poolStore

export {PoolStore}
export default poolStore

import {makeAutoObservable, runInAction} from "mobx"
import taskService from "./taskService.ts";
import toastUtil from "@/lib/toastUtil.ts";
import {format} from "date-fns";

export interface DataList {
  id: string;
  name: string;
  taskCategory: string;
  imageId: string;
  isNoEndDate: boolean;
  startDate: string;
  endDate: string;
  state: string
}

export interface QuestDto {
  id: string;
  name: string;
  eventId: string;
  periodValue: number;
  periodUnit: string;
  minCount: number;
  maxCount: number;
  continuous: boolean;
  aggregateType: string;
}

export interface DataRequest {
  id: string;
  name: string;
  startDate: Date | null;
  endDate: Date | null;
  isNoEndDate: boolean;
  periodValue: number;
  periodUnit: string;
  taskCategory: string;
  isRecurring: boolean;
  rewardAmount: number;
  questDtos: QuestDto[];
  slidingType: string;
  deepLink: string;
  description: string;
  position: number;
  imageId: string;
  otpCode: string;
  state: string;
}

type StatisticKey =
  | "periodUnit"
  | "questPeriodUnit"
  | "slidingType"
  | "taskCategory"

class TaskStore {
  isLoading: boolean = false
  isLoadingGet: boolean = false
  isLoadingBt: boolean = false
  objectList: Partial<Record<StatisticKey, string[] | null>> = {};
  loading: Record<StatisticKey, boolean> = {
    periodUnit: false,
    questPeriodUnit: false,
    slidingType: false,
    taskCategory: false,
  }
  isOk: boolean = false
  page: number = 0
  size: number = 10
  totalPages: number = 0
  searchKey: string = ""
  statusList: string[] = ["NEW", "REJECT", "ACTIVE", "INACTIVE", "COMPLETED", "DELETED"]
  statusUpdate: string = ""
  otpCode: string = ""
  id: string = ""
  errors: any = []
  lists: DataList[] = []
  dataRequest: DataRequest = {
    id: '',
    name: '',
    startDate: new Date(),
    endDate: new Date(),
    isNoEndDate: false,
    periodValue: 0,
    periodUnit: '',
    taskCategory: '',
    isRecurring: false,
    rewardAmount: 0,
    questDtos: [],
    slidingType: '',
    deepLink: '',
    description: '',
    position: 0,
    imageId: '',
    otpCode: '',
    state: ''
  }
  listQuests: any = []
  listQuestSelected: QuestDto[] = []
  listSlidingType: string[] = []
  
  constructor() {
    makeAutoObservable(this)
  }
  
  clearState = () => {
    this.dataRequest = {
      id: '',
      name: '',
      startDate: new Date(),
      endDate: new Date(),
      isNoEndDate: false,
      periodValue: 0,
      periodUnit: '',
      taskCategory: '',
      isRecurring: false,
      rewardAmount: 0,
      questDtos: [],
      slidingType: '',
      deepLink: '',
      description: '',
      position: 0,
      imageId: '',
      otpCode: '',
      state: ''
    }
    this.errors = []
    this.listQuestSelected = []
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
  
  async fetchOne(
    key: StatisticKey,
    apiCall: () => Promise<{ success: boolean; data?: string[]; message?: string }>
  ) {
    this.loading[key] = true;
    try {
      const response = await apiCall();
      runInAction(() => {
        if (response.success) {
          this.objectList[key] = response.data ?? null;
        } else {
          toastUtil.error(response.message || `Failed to fetch ${key}`);
          this.objectList[key] = null;
        }
      });
    } catch (e) {
      runInAction(() => {
        toastUtil.error(`Unexpected error in ${key}`);
        this.objectList[key] = null;
      });
    } finally {
      runInAction(() => {
        this.loading[key] = false;
      });
    }
  }
  
  callAllGet = async () => {
    await Promise.allSettled([
      this.fetchOne("periodUnit", taskService.getPeriodUnit),
      this.fetchOne("questPeriodUnit", taskService.getQuestPeriodUnit),
      this.fetchOne("taskCategory", taskService.getTaskCategory),
    ]);
  };
  
  getList = async () => {
    this.isLoading = true
    const response = await taskService.getList()
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
    const response = await taskService.getDetail(id)
    this.isLoadingGet = false
    
    if (response.success) {
      this.dataRequest = response.data
      this.dataRequest = {
        ...this.dataRequest,
        startDate: this.dataRequest.startDate ? new Date(this.dataRequest.startDate) : null,
        endDate: this.dataRequest.endDate ? new Date(this.dataRequest.endDate) : null,
      }
    } else {
      toastUtil.error(response.message || "Failed to fetch")
    }
  }
  
  getAllEvent = async () => {
    const response = await taskService.getAllEvent()
    if (response.success) {
      this.listQuests = response.data
    } else {
      toastUtil.error(response.message || "Failed to fetch")
    }
  }
  
  getSlidingType = async () => {
    const response = await taskService.getSlidingType()
    if (response.success) {
      this.listSlidingType = response.data
    } else {
      toastUtil.error(response.message || "Failed to fetch")
    }
  }
  
  create = async () => {
    const data: DataRequest | null = this.dataRequest
    const formattedData = {
      ...data,
      startDate: data.startDate && format(data.startDate, "yyyy-MM-dd"),
      endDate: data.endDate && format(data.endDate, "yyyy-MM-dd"),
    }
    await this.handleRequest(() => taskService.create(formattedData), "Created", false);
  }
  
  update = async () => {
    const data: DataRequest | null = this.dataRequest
    const formattedData = {
      ...data,
      startDate: data.startDate && format(data.startDate, "yyyy-MM-dd"),
      endDate: data.endDate && format(data.endDate, "yyyy-MM-dd"),
    }
    await this.handleRequest(() => taskService.update(data.id, formattedData), "Updated", false);
  }
  
  updateStatus = async () => {
    const result = await taskService.updateState(this.id, this.statusUpdate)
    if (result.success) {
      toastUtil.success("Updated")
      await this.getList()
    } else {
      toastUtil.error(result.message || "Failed to update")
    }
  }
  
  delete = async () =>
    this.handleRequest(() => taskService.delete(this.id), "Deleted", true);
}

const taskStore = new TaskStore()
export const useTaskStore = () => taskStore

export {TaskStore}
export default taskStore

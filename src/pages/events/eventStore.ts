import {makeAutoObservable} from "mobx"
import eventService from "./eventService.ts";
import toastUtil from "@/lib/toastUtil.ts";

export interface DataList {
  id: string;
  name: string;
  code: string;
  state: string;
  externalId: string;
  parameterized: boolean;
  eventParamResponses: EventParamResponsesMap[]
}

export interface DataRequest {
  id: string;
  name: string;
  code: string;
  state: string;
  externalId: string;
  parameterized: boolean;
  eventParamResponses: EventParamResponsesMap[]
}

export interface EventParamResponsesMap {
  externalId: string;
  name: string;
  dataType: string;
  operator: string
  value: number;
}

class EventStore {
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
    name: '',
    code: '',
    state: '',
    externalId: '',
    parameterized: false,
    eventParamResponses: [{
      externalId: '',
      name: '',
      dataType: '',
      operator: '',
      value: 0,
    }]
  }
  dataTypeList: any = []
  operatorList: any = []
  
  constructor() {
    makeAutoObservable(this)
  }
  
  clearState = () => {
    this.dataRequest = {
      id: '',
      name: '',
      code: '',
      state: '',
      externalId: '',
      parameterized: false,
      eventParamResponses: [{
        externalId: '',
        name: '',
        dataType: '',
        operator: '',
        value: 0,
      }]
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
    const response = await eventService.getList()
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
    const response = await eventService.getDetail(id)
    this.isLoadingGet = false
    
    if (response.success) {
      this.dataRequest = response.data
    } else {
      toastUtil.error(response.message || "Failed to fetch")
    }
  }
  
  getDataType = async () => {
    this.isLoadingGet = true
    const response = await eventService.getDataType()
    this.isLoadingGet = false
    
    if (response.success) {
      this.dataTypeList = response.data
    } else {
      toastUtil.error(response.message || "Failed to fetch")
    }
  }
  
  getOperator = async () => {
    this.isLoadingGet = true
    const response = await eventService.getOperator()
    this.isLoadingGet = false
    
    if (response.success) {
      this.operatorList = response.data
    } else {
      toastUtil.error(response.message || "Failed to fetch")
    }
  }
  
  create = async () => {
    const data: DataRequest | null = this.dataRequest
    const dataFormated: DataRequest = {...data, eventParamResponses: data.parameterized ? data.eventParamResponses : []}
    await this.handleRequest(() => eventService.create(dataFormated), "Created", false);
  }
  
  update = async () => {
    const data: DataRequest | null = this.dataRequest
    const dataFormated: DataRequest = {...data, eventParamResponses: data.parameterized ? data.eventParamResponses : []}
    await this.handleRequest(() => eventService.update(data.id, dataFormated), "Updated", false);
  }
  
  delete = async () =>
    this.handleRequest(() => eventService.delete(this.id), "Deleted", true);
}

const eventStore = new EventStore()
export const useAuthStore = () => eventStore

export {EventStore}
export default eventStore

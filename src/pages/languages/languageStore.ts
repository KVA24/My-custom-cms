import {makeAutoObservable} from "mobx"
import languageService from "./languageService.ts";
import toastUtil from "@/lib/toastUtil.ts";

export interface DataList {
  id: string;
  name: string,
  code: string,
  iconUrl: string,
  isDefault: boolean,
  position: number,
  state: string
}

export interface DataRequest {
  id: string;
  name: string,
  code: string,
  iconUrl: string | string[],
  isDefault: boolean,
  position: number,
  state: string
}

class LanguageStore {
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
  listAll: DataList[] = []
  dataRequest: DataRequest = {
    id: '',
    name: '',
    code: '',
    iconUrl: '',
    isDefault: false,
    position: 0,
    state: '',
  }
  languageId: any = ''
  
  constructor() {
    makeAutoObservable(this)
  }
  
  clearState = () => {
    this.dataRequest = {
      id: '',
      name: '',
      code: '',
      iconUrl: '',
      isDefault: false,
      position: 0,
      state: '',
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
    const response = await languageService.getList()
    this.isLoading = false
    
    if (response.success) {
      this.lists = response.data.data
      this.totalPages = response.data.metadata.totalPages
    } else {
      toastUtil.error(response.message || "Failed to fetch")
    }
  }
  
  getAll = async () => {
    this.isLoading = true
    const response = await languageService.getAll()
    this.isLoading = false
    
    if (response.success) {
      this.listAll = response.data
      this.languageId = response.data.find(lang => lang.isDefault)?.id
    } else {
      toastUtil.error(response.message || "Failed to fetch")
    }
  }
  
  getDetail = async (id: string) => {
    this.clearState()
    this.isLoadingGet = true
    const response = await languageService.getDetail(id)
    this.isLoadingGet = false
    
    if (response.success) {
      this.dataRequest = response.data
    } else {
      toastUtil.error(response.message || "Failed to fetch")
    }
  }
  
  create = async () => {
    await this.handleRequest(() => languageService.create(this.dataRequest), "Created", true);
  }
  
  update = async () => {
    await this.handleRequest(() => languageService.update(this.dataRequest.id, this.dataRequest), "Updated", true);
  }
  
  delete = async () =>
    this.handleRequest(() => languageService.delete(this.id), "Deleted", true);
}

const languageStore = new LanguageStore()
export const useLanguageStore = () => languageStore

export {LanguageStore}
export default languageStore

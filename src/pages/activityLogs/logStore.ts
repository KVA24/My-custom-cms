import {makeAutoObservable} from "mobx"
import logService from "./logService.ts";
import toastUtil from "@/lib/toastUtil.ts";
import {addDays} from "date-fns";

interface LogItem {
  id: number;
  username: string;
  accountRole: string;
  actionType: string;
  module: string;
  pathUri: string;
  createdAt: number;
  description: string;
  detail: any;
}

interface Metadata {
  next: string
  pre: string
  hasNextPage: boolean
  hasPrePage: boolean
  pageSize: number
}

class LogStore {
  isLoading: boolean = false
  isLoadingBt: boolean = false
  page: number = 0
  size: number = 10
  totalPages: number = 0
  next: string | undefined = ''
  previous: string | undefined = ''
  metadata: Metadata | null = null
  searchKey: string = ""
  searchRole: string = ""
  searchType: string = ""
  gte: Date | undefined = addDays(new Date(), -6)
  lte: Date | undefined = new Date()
  id: string = ""
  errors: any = []
  lists: LogItem[] = []
  actionList: string[] = ["CREATE", "UPDATE", "PUBLISH", "CHOOSE_ITEM", "DELETE", "IMPORT", "GENERATE", "ADD", "SUBTRACT"]
  roleList: string[] = ["ADMIN"]
  
  constructor() {
    makeAutoObservable(this)
  }
  
  clearState = () => {
    this.searchRole = ""
    this.searchKey = ""
    this.searchType = ""
    this.gte = undefined
    this.lte = undefined
    this.next = ''
    this.previous = ''
  }
  
  getList = async () => {
    this.isLoading = true
    const response = await logService.getList()
    this.isLoading = false
    
    if (response.success) {
      this.lists = response.data.data
      this.metadata = response.data.metadata
    } else {
      toastUtil.error(response.message || "Failed to fetch")
    }
  }
}

const logStore = new LogStore()
export const useAuthStore = () => logStore

export {LogStore}
export default logStore

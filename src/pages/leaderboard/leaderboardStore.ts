import {makeAutoObservable} from "mobx"
import leaderboardService from "./leaderboardService.ts";
import toastUtil from "@/lib/toastUtil.ts";
import {addDays} from "date-fns";

export interface UserData {
  id: string
  createdAt: string
  state: string
  username: string
}

interface Metadata {
  next: string
  pre: string
  hasNextPage: boolean
  hasPrePage: boolean
  pageSize: number
}

class LeaderboardStore {
  isLoading: boolean = false
  isLoadingBt: boolean = false
  isLoadingGet: boolean = false
  page: number = 0
  size: number = 10
  totalPages: number = 0
  metadata: Metadata | null = null
  next: string | undefined = ''
  previous: string | undefined = ''
  searchKey: string = ""
  gte: Date | undefined = addDays(new Date(), -6)
  lte: Date | undefined = new Date()
  date: Date | undefined = new Date()
  dataLeaderboard: any[] = []
  listWeek: any[] = []
  listYear: any[] = []
  year: any = new Date().getFullYear()
  weekId: any = 0
  
  constructor() {
    makeAutoObservable(this)
  }
  
  clearState = () => {
    this.searchKey = ""
    this.gte = addDays(new Date(), -6)
    this.lte = new Date()
    this.date = new Date()
    this.listWeek = []
    this.listYear = []
    this.year = new Date().getFullYear()
    this.weekId = 0
  }
  
  getList = async () => {
    this.isLoading = true
    const response = await leaderboardService.getList()
    this.isLoading = false
    
    if (response.success) {
      this.dataLeaderboard = response.data.data
      this.metadata = response.data.metadata
    } else {
      this.dataLeaderboard = []
      toastUtil.error(response.message || "Failed to fetch")
    }
  }
  
  exportData = async () => {
    this.isLoadingBt = true
    const response = await leaderboardService.exportExcel()
    this.isLoadingBt = false
  }
}

const leaderboardStore = new LeaderboardStore()
export const useLeaderboardStore = () => leaderboardStore

export {LeaderboardStore}
export default leaderboardStore

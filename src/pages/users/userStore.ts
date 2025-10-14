import {makeAutoObservable} from "mobx"
import userService from "./userService.ts";
import toastUtil from "@/lib/toastUtil.ts";
import {addDays} from "date-fns";

export interface UserData {
  id: string
  createdAt: string
  state: string
  username: string
  userWallets: ItemData[]
}

export interface ItemData {
  id: string
  userId: string
  itemId: string
  item: {
    id: string
    code: string
    name: string
    type: string
    convertRate: number
    sourceType: string
  }
  balance: number
}

interface TransactionData {
  id: string
  userId: string
  itemId: string
  item: ItemTransaction
  action: "ADD" | "REMOVE" | "UPDATE" | string
  sourceType: "EXCHANGE_TURN" | "PURCHASE" | "GAME" | string
  amount: number
  balance: number
  sessionId: string
  storeItemId: string
  prizeId: string
  transactionId: string
  note: string
  createdAt: number
  updatedAt: number
}

interface ItemTransaction {
  id: string
  code: string
  name: string
  type: "MIX" | "DIAMOND" | "TURN_FREE" | "TURN_PAID" | "HAMMER" | string
  convertRate: number
  sourceType: "GAME" | "EXTERNAL" | string
}

interface Metadata {
  next: string
  pre: string
  hasNextPage: boolean
  hasPrePage: boolean
  pageSize: number
}

export enum UserTabs {
  transaction = "transaction",
  ranking = "ranking",
}

class UserStore {
  isLoading: boolean = false
  isLoadingGet: boolean = false
  tabActive: UserTabs = UserTabs.transaction
  page: number = 0
  size: number = 10
  totalPages: number = 0
  metadata: Metadata | null = null
  next: string | undefined = ''
  previous: string | undefined = ''
  searchId: string = ""
  searchKey: string = ""
  gte: Date | undefined = addDays(new Date(), -6)
  lte: Date | undefined = new Date()
  typeTransaction: string = ""
  action: string = ""
  searchItem: string = ""
  id: string = ""
  lists: any[] = []
  dataUser: UserData | null = null
  dataTransaction: TransactionData[] = []
  typeTransactionList: string[] = ["EXCHANGE_TURN", "PRIZE", "PLAY_GAME", "IAP", "USE_IN_GAME", "DAILY_RESET", "JACKPOT", "INIT_USER", "FROM_3RD", "MPS"]
  itemList: any = []
  
  constructor() {
    makeAutoObservable(this)
  }
  
  clearState = () => {
    this.searchId = ""
    this.searchKey = ""
    this.typeTransaction = ""
    this.action = ""
    this.searchItem = ""
    this.gte = addDays(new Date(), -6)
    this.lte = new Date()
    this.next = ''
    this.previous = ''
    this.action = ""
  }
  
  setRange(range: { from?: Date; to?: Date } | undefined) {
    if (range?.from) {
      this.gte = range.from;
    }
    if (range?.to) {
      this.lte = range.to;
    }
  }
  
  getItemList = async () => {
    const response = await userService.getItemList()
    
    if (response.success) {
      this.itemList = response.data
    } else {
      toastUtil.error(response.message || "Failed to fetch")
    }
  }
  
  getList = async () => {
    this.isLoading = true
    const response = await userService.getList()
    this.isLoading = false
    
    if (response.success) {
      this.lists = response.data.data
      this.totalPages = response.data.metadata.totalPages
    } else {
      toastUtil.error(response.message || "Failed to fetch")
    }
  }
  
  getDetail = async (id: string | undefined) => {
    this.isLoadingGet = true
    const response = await userService.getDetail(id)
    this.isLoadingGet = false
    
    if (response.success) {
      this.dataUser = response.data
    } else {
      toastUtil.error(response.message || "Failed to fetch")
    }
  }
  
  getTransaction = async (id: string | undefined) => {
    this.isLoading = true
    const response = await userService.getTransaction(id)
    this.isLoading = false
    
    if (response.success) {
      this.dataTransaction = response.data.data
      this.metadata = response.data.metadata
    } else {
      toastUtil.error(response.message || "Failed to fetch")
    }
  }
}

const userStore = new UserStore()
export const useAuthStore = () => userStore

export {UserStore}
export default userStore

import {makeAutoObservable} from "mobx"
import transactionService from "./transactionService.ts";
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
  transId: string
  userId: string
  userName: string
  username: string
  itemId: string
  item: ItemTransaction
  action: "ADD" | "REMOVE" | "UPDATE" | string
  sourceType: "EXCHANGE_TURN" | "PURCHASE" | "GAME" | "IAP" | string
  turnType: string
  amount: number
  balance: number
  sessionId: string
  storeItemId: string
  prizeId: string
  transactionId: string
  note: string
  createdAt: number
  updatedAt: number
  type: string,
  chargeType: string,
  paymentMethod: string,
  packageCode: string,
  itemName: string,
  storeItemName: string,
  price: number,
  state: string,
  rewardName: string,
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

export enum TransactionTabs {
  energy = "energy",
  purchases = "purchases",
  reward = "reward",
}

class TransactionStore {
  isLoading: boolean = false
  isLoadingBt: boolean = false
  isLoadingGet: boolean = false
  tabActive: TransactionTabs = TransactionTabs.energy
  page: number = 0
  size: number = 10
  totalPages: number = 0
  metadata: Metadata | null = null
  next: string | undefined = ''
  previous: string | undefined = ''
  searchId: string = ""
  searchUsername: string = ""
  searchPackage: string = ""
  searchStore: string = ""
  searchReward: string = ""
  searchType: string = ""
  searchPaymentMethod: string = ""
  searchChargeType: string = ""
  gte: Date | undefined = addDays(new Date(), -6)
  lte: Date | undefined = new Date()
  typeTransaction: string = ""
  id: string = ""
  lists: any[] = []
  dataUser: UserData | null = null
  dataTransaction: TransactionData[] = []
  typeTransactionList: string[] = ["PRIZE", "PLAY_GAME", "IAP", "DAILY_RESET", "INIT_USER"]
  typeList: string[] = ["KS", "DIAMOND"]
  paymentMethodList: string[] = ["MPS", "SMS", "USSD", "GAME"]
  chargeTypeList: string[] = ["RENEW", "REGISTER", "UNSUBSCRIBE", "CHARGE"]
  storeList: any = []
  rewardList: any = []
  
  constructor() {
    makeAutoObservable(this)
  }
  
  clearState = () => {
    this.searchId = ""
    this.searchUsername = ""
    this.searchPackage = ""
    this.typeTransaction = ""
    this.gte = addDays(new Date(), -6)
    this.lte = new Date()
    this.next = ''
    this.previous = ''
    this.searchStore = ''
    this.searchReward = ''
    this.searchType = ''
    this.searchPaymentMethod = ''
    this.searchChargeType = ''
  }
  
  getTransaction = async () => {
    this.isLoading = true
    const response = await transactionService.getTransaction()
    this.isLoading = false
    
    if (response.success) {
      this.dataTransaction = response.data.data
      this.metadata = response.data.metadata
    } else {
      toastUtil.error(response.message || "Failed to fetch")
    }
  }
  
  getStoreList = async () => {
    const response = await transactionService.getStoreList()
    
    if (response.success) {
      this.storeList = response.data
    } else {
      toastUtil.error(response.message || "Failed to fetch")
    }
  }
  
  getRewardList = async () => {
    const response = await transactionService.getRewardList()
    
    if (response.success) {
      this.rewardList = response.data
    } else {
      toastUtil.error(response.message || "Failed to fetch")
    }
  }
  
  exportData = async () => {
    this.isLoadingBt = true
    const response = await transactionService.exportExcel()
    this.isLoadingBt = false
  }
}

const transactionStore = new TransactionStore()
export const useTransactionStore = () => transactionStore

export {TransactionStore}
export default transactionStore

import apiClient, {type ApiResponse} from "../../lib/api.ts"
import transactionStore from "./transactionStore.ts";
import {format} from "date-fns";

export class TransactionService {
  async getTransaction(): Promise<ApiResponse> {
    const path = `/v1/portal/transactions/${transactionStore.tabActive}?limit=${transactionStore.size}${
      transactionStore.next ? `&next=${transactionStore.next}` : ''
    }${transactionStore.previous ? `&pre=${transactionStore.previous}` : ''}${
      transactionStore.searchUsername ? `&username=${encodeURIComponent(transactionStore.searchUsername)}` : ''
    }${transactionStore.searchPackage ? `&packageCode=${encodeURIComponent(transactionStore.searchPackage)}` : ''}${
      transactionStore.typeTransaction ? `&sourceType=${transactionStore.typeTransaction}` : ''
    }${transactionStore.searchId ? `&transId=${transactionStore.searchId}` : ''}${
      transactionStore.searchStore ? `&storeItemId=${transactionStore.searchStore}` : ''
    }${transactionStore.searchReward ? `&rewardId=${transactionStore.searchReward}` : ''}${
      transactionStore.searchType ? `&type=${transactionStore.searchType}` : ''
    }${transactionStore.searchPaymentMethod ? `&paymentMethod=${transactionStore.searchPaymentMethod}` : ''
    }${transactionStore.searchChargeType ? `&chargeType=${transactionStore.searchChargeType}` : ''}${
      transactionStore.gte ? `&gte=${format(transactionStore.gte, "yyyy-MM-dd")}` : ''
    }${transactionStore.lte ? `&lte=${format(transactionStore.lte, "yyyy-MM-dd")}` : ''}`
    return apiClient.get(path)
  }
  
  async getStoreList(): Promise<ApiResponse> {
    const path = `/v1/portal/store-items/all`
    return apiClient.get(path)
  }
  
  async getRewardList(): Promise<ApiResponse> {
    const path = `/v1/portal/rewards/all`
    return apiClient.get(path)
  }
  
  async exportExcel(): Promise<void> {
    const path = `/v1/portal/transactions/${transactionStore.tabActive}/export-excel?${
      transactionStore.searchUsername ? `&username=${encodeURIComponent(transactionStore.searchUsername)}` : ''
    }${transactionStore.searchPackage ? `&packageCode=${encodeURIComponent(transactionStore.searchPackage)}` : ''}${
      transactionStore.typeTransaction ? `&sourceType=${transactionStore.typeTransaction}` : ''
    }${transactionStore.searchId ? `&transId=${transactionStore.searchId}` : ''}${
      transactionStore.searchStore ? `&storeItemId=${transactionStore.searchStore}` : ''
    }${transactionStore.searchReward ? `&rewardId=${transactionStore.searchReward}` : ''}${
      transactionStore.searchType ? `&type=${transactionStore.searchType}` : ''
    }${transactionStore.searchPaymentMethod ? `&paymentMethod=${transactionStore.searchPaymentMethod}` : ''
    }${transactionStore.searchChargeType ? `&chargeType=${transactionStore.searchChargeType}` : ''}${
      transactionStore.gte ? `&gte=${format(transactionStore.gte, "yyyy-MM-dd")}` : ''
    }${transactionStore.lte ? `&lte=${format(transactionStore.lte, "yyyy-MM-dd")}` : ''}`
    return apiClient.exportFile(path, {}, `Transaction_${transactionStore.tabActive}-${format(transactionStore.lte ?? new Date(), "yyyy-MM-dd")}_${format(transactionStore.gte ?? new Date(), "yyyy-MM-dd")}.xlsx`)
  }
}

export const transactionService = new TransactionService()
export default transactionService

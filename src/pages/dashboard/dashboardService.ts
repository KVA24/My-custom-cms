import apiClient, {type ApiResponse} from "../../lib/api.ts"
import {format} from "date-fns/format"
import dashboardStore from "@/pages/dashboard/dashboardStore.ts";

export class DashboardService {
  async getStatisticActivePlayers(start: Date, end: Date): Promise<ApiResponse> {
    const path = `/v1/portal/statistics/active-players?type=${dashboardStore.type}&gte=${format(start, "yyyy-MM-dd")}&lte=${format(end, "yyyy-MM-dd")}`
    return apiClient.get(path)
  }
  
  async getStatisticDailyActiveUsers(start: Date, end: Date): Promise<ApiResponse> {
    const path = `/v1/portal/statistics/daily-active-users?gte=${format(start, "yyyy-MM-dd")}&lte=${format(end, "yyyy-MM-dd")}`
    return apiClient.get(path)
  }
  
  async getStatisticEnergyAdded(start: Date, end: Date): Promise<ApiResponse> {
    const path = `/v1/portal/statistics/energy-added?gte=${format(start, "yyyy-MM-dd")}&lte=${format(end, "yyyy-MM-dd")}`
    return apiClient.get(path)
  }
  
  async getStatisticEnergyConsumption(start: Date, end: Date): Promise<ApiResponse> {
    const path = `/v1/portal/statistics/energy-consumption?gte=${format(start, "yyyy-MM-dd")}&lte=${format(end, "yyyy-MM-dd")}`
    return apiClient.get(path)
  }
  
  async getStatisticPaidPlayers(start: Date, end: Date): Promise<ApiResponse> {
    const path = `/v1/portal/statistics/paid-players?type=${dashboardStore.type}&gte=${format(start, "yyyy-MM-dd")}&lte=${format(end, "yyyy-MM-dd")}`
    return apiClient.get(path)
  }
  
  async getStatisticRevenue(start: Date, end: Date): Promise<ApiResponse> {
    const path = `/v1/portal/statistics/revenues?gte=${format(start, "yyyy-MM-dd")}&lte=${format(end, "yyyy-MM-dd")}`
    return apiClient.get(path)
  }
  
  async getStatisticRewardedPrizes(start: Date, end: Date): Promise<ApiResponse> {
    const path = `/v1/portal/statistics/rewarded-prizes?gte=${format(start, "yyyy-MM-dd")}&lte=${format(end, "yyyy-MM-dd")}`
    return apiClient.get(path)
  }
  
  async getStatisticReward(start: Date, end: Date): Promise<ApiResponse> {
    const path = `/v1/portal/statistics/reward-statistics?gte=${format(start, "yyyy-MM-dd")}&lte=${format(end, "yyyy-MM-dd")}`
    return apiClient.get(path)
  }
  
  async getStatisticPurchases(start: Date, end: Date): Promise<ApiResponse> {
    const path = `/v1/portal/statistics/purchase-statistics?gte=${format(start, "yyyy-MM-dd")}&lte=${format(end, "yyyy-MM-dd")}`
    return apiClient.get(path)
  }
}

export const dashboardService = new DashboardService()
export default dashboardService

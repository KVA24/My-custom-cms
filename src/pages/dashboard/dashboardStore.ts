import {makeAutoObservable, runInAction} from "mobx";
import dashboardService from "./dashboardService.ts";
import toastUtil from "@/lib/toastUtil.ts";
import {addDays} from "date-fns";

interface ItemData {
  title: string
  rewardName: string
  storeItemName: string
  type: string
  total: number
  totalRevenue: number
  totalRewardedQuantity: number
  totalRewardedValue: number
  totalQuantity: number
  updatedAt: number
}

export interface DataPoint {
  date: string
  month: number
  year: number
  totalActiveUser: number
  totalActivePlayer: number
  totalPaidPlayer: number
  data: ItemData[]
}

type StatisticKey =
  | "activePlayers"
  | "dailyActiveUsers"
  | "energyAdded"
  | "energyConsumption"
  | "paidPlayers"
  | "revenue"
  | "rewardedPrizes"
  | "rewardStatistic"
  | "purchaseStatistic"

export enum DashboardTabs {
  dashboard = "dashboard",
  reward = "reward",
  purchase = "purchase",
}

class DashboardStore {
  gte: Date = addDays(new Date(), -6);
  lte: Date = new Date();
  tabActive: DashboardTabs = DashboardTabs.dashboard;
  
  type: string = "DAILY";
  statistics: Partial<Record<StatisticKey, DataPoint[] | null>> = {};
  
  loading: Record<StatisticKey, boolean> = {
    activePlayers: false,
    dailyActiveUsers: false,
    energyAdded: false,
    energyConsumption: false,
    paidPlayers: false,
    revenue: false,
    rewardedPrizes: false,
    rewardStatistic: false,
    purchaseStatistic: false,
  };
  
  constructor() {
    makeAutoObservable(this);
  }
  
  private async fetchOne(
    key: StatisticKey,
    apiCall: (gte: Date, lte: Date) => Promise<{ success: boolean; data?: DataPoint[]; message?: string }>
  ) {
    this.loading[key] = true;
    try {
      const response = await apiCall(this.gte, this.lte);
      runInAction(() => {
        if (response.success) {
          this.statistics[key] = response.data ?? null;
        } else {
          toastUtil.error(response.message || `Failed to fetch ${key}`);
          this.statistics[key] = null;
        }
      });
    } catch (e) {
      runInAction(() => {
        toastUtil.error(`Unexpected error in ${key}`);
        this.statistics[key] = null;
      });
    } finally {
      runInAction(() => {
        this.loading[key] = false;
      });
    }
  }
  
  // gọi tất cả API đồng thời
  callAllStatistics = async () => {
    await Promise.allSettled([
      this.fetchOne("dailyActiveUsers", dashboardService.getStatisticDailyActiveUsers),
      this.fetchOne("energyAdded", dashboardService.getStatisticEnergyAdded),
      this.fetchOne("energyConsumption", dashboardService.getStatisticEnergyConsumption),
      this.fetchOne("revenue", dashboardService.getStatisticRevenue),
      this.fetchOne("rewardedPrizes", dashboardService.getStatisticRewardedPrizes),
    ]);
  };
  
  callStatisticWithType = async () => {
    await Promise.allSettled([
      this.fetchOne("activePlayers", dashboardService.getStatisticActivePlayers),
      this.fetchOne("paidPlayers", dashboardService.getStatisticPaidPlayers),
    ]);
  };
  
  callStatisticReward = async () => {
    await Promise.allSettled([
      this.fetchOne("rewardStatistic", dashboardService.getStatisticReward),
    ]);
  };
  
  callStatisticPurchase = async () => {
    await Promise.allSettled([
      this.fetchOne("purchaseStatistic", dashboardService.getStatisticPurchases),
    ]);
  }
}

const dashboardStore = new DashboardStore();
export const useDashboardStore = () => dashboardStore;
export {DashboardStore};
export default dashboardStore;

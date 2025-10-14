import apiClient, {type ApiResponse} from "../../lib/api.ts"
import leaderboardStore from "@/pages/leaderboard/leaderboardStore.ts";

export class LeaderboardService {
  async getList(): Promise<ApiResponse> {
    const path = `/v1/portal/leaderboard/weekly?limit=${leaderboardStore.size}${
      leaderboardStore.next ? `&next=${leaderboardStore.next}` : ''
    }${leaderboardStore.previous ? `&pre=${leaderboardStore.previous}` : ''}&week=${leaderboardStore.weekId}&year=${leaderboardStore.year}${leaderboardStore.searchKey ? `&username=${encodeURIComponent(leaderboardStore.searchKey)}` : ''}`
    return apiClient.get(path)
  }
  
  async exportExcel(): Promise<void> {
    const path = `/v1/portal/leaderboard/weekly/export-excel?week=${leaderboardStore.weekId}&year=${leaderboardStore.year}`
    return apiClient.exportFile(path, {}, `Leaderboard_${leaderboardStore.weekId}-${leaderboardStore.year}.xlsx`)
  }
}

export const leaderboardService = new LeaderboardService()
export default leaderboardService

import { apiClient } from "./apiClient";

export const dashboardApi = {
   getDashboardData : () => apiClient.get("/dashboard")
}
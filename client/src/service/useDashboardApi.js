import { useQuery } from "@tanstack/react-query"
import { dashboardApi } from "./api/dashboardApi"

export const useGetDashboardData = () => {
    return useQuery({
        queryKey: ["dashboard"],
        queryFn: dashboardApi.getDashboardData,
        retry: 3,
        staleTime: 1000 * 60 * 5
    })
}
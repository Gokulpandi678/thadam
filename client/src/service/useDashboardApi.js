import { useQuery } from "@tanstack/react-query"
import { dashboardApi } from "./api/dashboardApi"
import { qk } from "./queryKeys";

export const useGetDashboardData = () => {
    return useQuery({
        queryKey: qk.dashboard(),
        queryFn: dashboardApi.getDashboardData,
        retry: 3,
        staleTime: 1000 * 60 * 5
    })
}

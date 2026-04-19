import { useMutation } from "@tanstack/react-query"
import { authApi } from "./api/authApi"

export const useLogoutUser = () => {
    return useMutation({
        mutationFn: () => authApi.logout(),
    })
}
import { apiClient } from "./apiClient";

// Same paramsSerializer as customerApi — handles multi-value array params
const paramsSerializer = (params) => {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach(v => search.append(key, v));
        } else if (value !== undefined && value !== null && value !== "") {
            search.append(key, value);
        }
    });
    return search.toString();
};

export const clientApi = {
    // Mirrors customerApi.getCustomers
    getClients: (params = {}) =>
        apiClient.get("/clients/getAllClients", { params, paramsSerializer }),

    // Mirrors customerApi.getFilterOptions
    getFilterOptions: () =>
        apiClient.get("/clients/filterOptions"),

    // Mirrors customerApi.getCustomerById — returns client + full customer + logs
    getClientByCustomerId: (customerId) =>
        apiClient.get(`/clients/${customerId}`),

    convertAsClient: (customerId, params) =>
        apiClient.post(`/clients/${customerId}/convert`, params),

    updateClient: (customerId, params) =>
        apiClient.put(`/clients/${customerId}`, params),

    revertClient: (customerId) =>
        apiClient.delete(`/clients/${customerId}/revert`),
};
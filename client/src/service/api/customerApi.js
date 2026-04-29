import { apiClient } from "./apiClient";

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

export const customerApi = {
    getCustomers: (params = {}) =>
        apiClient.get("/customers/getAllCustomers", { params, paramsSerializer }),

    getFilterOptions: () =>
        apiClient.get("/customers/filterOptions"),

    getCustomerById: (id) =>
        apiClient.get(`/customers/${id}`),

    createCustomer: (params) =>
        apiClient.post('/customers/createCustomer', params),

    updateCustomer: (id, params) =>
        apiClient.put(`/customers/updateCustomer/${id}`, params),

    deleteCustomer: (id) =>
        apiClient.delete(`/customers/deleteCustomer/${id}`),

    addLog: (customerId, params) =>
        apiClient.post(`/customers/${customerId}/addLogs`, params),

    editLog: (customerId, logId, params) =>
        apiClient.put(`/customers/${customerId}/editLog/${logId}`, params),

    deleteLog: (customerId, logId) =>
        apiClient.delete(`/customers/${customerId}/deleteLog/${logId}`),

    addProfilePic: (id, file) => {
        const formData = new FormData();
        formData.append("file", file);
        return apiClient.post(`/customers/${id}/addProfilePic`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },

    editProfilePic: (id, file) => {
        const formData = new FormData();
        formData.append("file", file);
        return apiClient.put(`/customers/${id}/editProfilePic`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },

    deleteProfilePic: (id) =>
        apiClient.delete(`/customers/${id}/deleteProfilePic`),

    getDeletedCustomers: () =>
        apiClient.get("/customers/recycle-bin"),

    restoreCustomer: (id) =>
        apiClient.put(`/customers/recycle-bin/${id}/restore`),

    permanentlyDeleteCustomer: (id) =>
        apiClient.delete(`/customers/recycle-bin/${id}/permanent`),
};

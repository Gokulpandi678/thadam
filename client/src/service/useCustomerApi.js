import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { customerApi } from './api/customerApi';
import { queryClient } from '../utils/queryClient';
import toast from 'react-hot-toast';

const delay = () => new Promise(resolve => setTimeout(resolve, 1000));

export const useGetCustomers = (filterParams = {}) => {
    return useInfiniteQuery({
        queryKey: ['allCustomer', filterParams],
        queryFn: ({ pageParam = 0 }) =>
            customerApi.getCustomers({ ...filterParams, page: pageParam }),
        getNextPageParam: (lastPage) => {
            const { currentPage, hasNext } = lastPage.data.result;
            return hasNext ? currentPage + 1 : undefined;
        },
        retry: 1,
    });
};

export const useGetCustomerFilterOptions = () => {
    return useQuery({
        queryKey: ['customerFilterOptions'],
        queryFn: () => customerApi.getFilterOptions(),
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });
};

export const useGetCustomerById = (id) => {
    return useQuery({
        queryKey: ["customer", id],
        queryFn: () => customerApi.getCustomerById(id),
        staleTime: 5 * 60 * 1000,
        retry: 2
    });
};

// method to call create customer api
export const useCreateCustomer = () => {
    return useMutation({
        mutationFn: async (params) => {
            await delay();
            return customerApi.createCustomer(params);
        },
        onMutate: () => {
            const toastId = toast.loading("Creating contact...");
            return { toastId };
        },
        onSuccess: (data, variables, context) => {
            toast.success("Contact created successfully", { id: context.toastId });
            queryClient.invalidateQueries({ queryKey: ['allCustomer'] });
            queryClient.invalidateQueries({ queryKey: ['customerFilterOptions'] });
        },
        onError: (error, variables, context) => {
            toast.error("Failed to create customer", { id: context.toastId });
            console.error("Failed to create customer:", error);
        }
    });
};

export const useUpdateCustomer = () => {
    return useMutation({
        mutationFn: async ({ id, params }) => {
            await delay();
            return customerApi.updateCustomer(id, params);
        },
        onMutate: () => {
            const toastId = toast.loading("Updating contact...");
            return { toastId };
        },
        onSuccess: (data, variables, context) => {
            toast.success("Contact updated successfully", { id: context.toastId });
            queryClient.invalidateQueries({ queryKey: ['allCustomer'] });
            queryClient.invalidateQueries({ queryKey: ['customerFilterOptions'] });
            queryClient.invalidateQueries({ queryKey: ["customer", variables.id] });
        },
        onError: (error, variables, context) => {
            toast.error("Failed to update customer", { id: context.toastId });
            console.error("Failed to update customer:", error);
        }
    });
};

export const useDeleteCustomer = () => {
    return useMutation({
        mutationFn: async ({ id }) => {
            await delay();
            return customerApi.deleteCustomer(id);
        },
        onMutate: () => {
            const toastId = toast.loading("Deleting contact...");
            return { toastId };
        },
        onSuccess: (data, variables, context) => {
            toast.success("Contact deleted successfully", { id: context.toastId });
            queryClient.invalidateQueries({ queryKey: ['allCustomer'] });
            queryClient.invalidateQueries({ queryKey: ['customerFilterOptions'] });
        },
        onError: (error, variables, context) => {
            toast.error("Failed to delete customer", { id: context.toastId });
            console.error("Failed to delete customer:", error);
        }
    });
};

export const useAddCustomerLog = () => {
    return useMutation({
        mutationFn: async ({ customerId, params }) => {
            await delay();
            return customerApi.addLog(customerId, params);
        },
        onMutate: () => {
            const toastId = toast.loading("Logging meeting...");
            return { toastId };
        },
        onSuccess: (data, variables, context) => {
            toast.success("Meeting logged successfully", { id: context.toastId });
            queryClient.invalidateQueries({ queryKey: ["customer", variables.customerId] });
        },
        onError: (error, variables, context) => {
            toast.error("Failed to log meeting", { id: context.toastId });
            console.error("Failed to log meeting:", error);
        }
    });
};

// ── Profile Picture Mutations ──────────────────────────────────────────────────

export const useAddProfilePic = () => {
    return useMutation({
        mutationFn: async ({ id, file }) => {
            await delay();
            return customerApi.addProfilePic(id, file);
        },
        onMutate: () => {
            const toastId = toast.loading("Uploading profile picture...");
            return { toastId };
        },
        onSuccess: (data, variables, context) => {
            toast.success("Profile picture uploaded successfully", { id: context.toastId });
            queryClient.invalidateQueries({ queryKey: ["customer", variables.id] });
            queryClient.invalidateQueries({ queryKey: ['allCustomer'] });
        },
        onError: (error, variables, context) => {
            toast.error("Failed to upload profile picture", { id: context.toastId });
            console.error("Failed to upload profile picture:", error);
        }
    });
};

export const useEditProfilePic = () => {
    return useMutation({
        mutationFn: async ({ id, file }) => {
            await delay();
            return customerApi.editProfilePic(id, file);
        },
        onMutate: () => {
            const toastId = toast.loading("Updating profile picture...");
            return { toastId };
        },
        onSuccess: (data, variables, context) => {
            toast.success("Profile picture updated successfully", { id: context.toastId });
            queryClient.invalidateQueries({ queryKey: ["customer", variables.id] });
            queryClient.invalidateQueries({ queryKey: ['allCustomer'] });
        },
        onError: (error, variables, context) => {
            toast.error("Failed to update profile picture", { id: context.toastId });
            console.error("Failed to update profile picture:", error);
        }
    });
};

export const useDeleteProfilePic = () => {
    return useMutation({
        mutationFn: async ({ id }) => {
            await delay();
            return customerApi.deleteProfilePic(id);
        },
        onMutate: () => {
            const toastId = toast.loading("Removing profile picture...");
            return { toastId };
        },
        onSuccess: (data, variables, context) => {
            toast.success("Profile picture removed", { id: context.toastId });
            queryClient.invalidateQueries({ queryKey: ["customer", variables.id] });
            queryClient.invalidateQueries({ queryKey: ['allCustomer'] });
        },
        onError: (error, variables, context) => {
            toast.error("Failed to remove profile picture", { id: context.toastId });
            console.error("Failed to remove profile picture:", error);
        }
    });
};

export const useGetDeletedCustomers = () => {
    return useQuery({
        queryKey: ['deletedCustomers'],
        queryFn: () => customerApi.getDeletedCustomers(),
        staleTime: 2 * 60 * 1000,
        retry: 1,
    });
};

export const useRestoreCustomer = () => {
    return useMutation({
        mutationFn: async ({ id }) => {
            await delay();
            return customerApi.restoreCustomer(id);
        },
        onMutate: () => {
            const toastId = toast.loading("Restoring contact...");
            return { toastId };
        },
        onSuccess: (data, variables, context) => {
            toast.success("Contact restored successfully", { id: context.toastId });
            queryClient.invalidateQueries({ queryKey: ['deletedCustomers'] });
            queryClient.invalidateQueries({ queryKey: ['allCustomer'] });
            queryClient.invalidateQueries({ queryKey: ['customerFilterOptions'] });
        },
        onError: (error, variables, context) => {
            toast.error("Failed to restore contact", { id: context.toastId });
            console.error("Failed to restore contact:", error);
        }
    });
};

export const usePermanentlyDeleteCustomer = () => {
    return useMutation({
        mutationFn: async ({ id }) => {
            await delay();
            return customerApi.permanentlyDeleteCustomer(id);
        },
        onMutate: () => {
            const toastId = toast.loading("Permanently deleting contact...");
            return { toastId };
        },
        onSuccess: (data, variables, context) => {
            toast.success("Contact permanently deleted", { id: context.toastId });
            queryClient.invalidateQueries({ queryKey: ['deletedCustomers'] });
        },
        onError: (error, variables, context) => {
            toast.error("Failed to permanently delete contact", { id: context.toastId });
            console.error("Failed to permanently delete contact:", error);
        }
    });
};
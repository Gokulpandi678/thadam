import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { customerApi } from './api/customerApi';
import { queryClient } from '../utils/queryClient';
import toast from 'react-hot-toast';
import logger from '../utils/logger';
import { qk } from './queryKeys';

export const useGetCustomers = (filterParams = {}) => {
    return useInfiniteQuery({
        queryKey: qk.allCustomers(filterParams),
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
        queryKey: qk.customerFilterOptions(),
        queryFn: () => customerApi.getFilterOptions(),
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });
};

export const useGetCustomerById = (id) => {
    return useQuery({
        queryKey: qk.customer(id),
        queryFn: () => customerApi.getCustomerById(id),
        staleTime: 5 * 60 * 1000,
        retry: 2,
        enabled: !!id
    });
};

// method to call create customer api
export const useCreateCustomer = () => {
    return useMutation({
        mutationFn: (params) => customerApi.createCustomer(params),
        onMutate: () => {
            const toastId = toast.loading("Creating contact...");
            return { toastId };
        },
        onSuccess: (data, variables, context) => {
            toast.success("Contact created successfully", { id: context.toastId });
            queryClient.invalidateQueries({ queryKey: qk.allCustomers() });
            queryClient.invalidateQueries({ queryKey: qk.customerFilterOptions() });
        },
        onError: (error, variables, context) => {
            toast.error("Failed to create customer", { id: context.toastId });
            logger.error(error, 'useCreateCustomer');
        }
    });
};

export const useUpdateCustomer = () => {
    return useMutation({
        mutationFn: ({ id, params }) => customerApi.updateCustomer(id, params),
        onMutate: () => {
            const toastId = toast.loading("Updating contact...");
            return { toastId };
        },
        onSuccess: (data, variables, context) => {
            toast.success("Contact updated successfully", { id: context.toastId });
            queryClient.invalidateQueries({ queryKey: qk.allCustomers() });
            queryClient.invalidateQueries({ queryKey: qk.customerFilterOptions() });
            queryClient.invalidateQueries({ queryKey: qk.customer(variables.id) });
        },
        onError: (error, variables, context) => {
            toast.error("Failed to update customer", { id: context.toastId });
            logger.error(error, 'useUpdateCustomer');
        }
    });
};

export const useDeleteCustomer = () => {
    return useMutation({
        mutationFn: ({ id }) => customerApi.deleteCustomer(id),
        onMutate: () => {
            const toastId = toast.loading("Deleting contact...");
            return { toastId };
        },
        onSuccess: (data, variables, context) => {
            toast.success("Contact deleted successfully", { id: context.toastId });
            queryClient.invalidateQueries({ queryKey: qk.allCustomers() });
            queryClient.invalidateQueries({ queryKey: qk.customerFilterOptions() });
        },
        onError: (error, variables, context) => {
            toast.error("Failed to delete customer", { id: context.toastId });
            logger.error(error, 'useDeleteCustomer');
        }
    });
};

export const useAddCustomerLog = () => {
    return useMutation({
        mutationFn: ({ customerId, params }) => customerApi.addLog(customerId, params),
        onMutate: () => {
            const toastId = toast.loading("Logging meeting...");
            return { toastId };
        },
        onSuccess: (data, variables, context) => {
            toast.success("Meeting logged successfully", { id: context.toastId });
            queryClient.invalidateQueries({ queryKey: qk.customer(variables.customerId) });
        },
        onError: (error, variables, context) => {
            toast.error("Failed to log meeting", { id: context.toastId });
            logger.error(error, 'useAddCustomerLog');
        }
    });
};

export const useEditCustomerLog = () => {
    return useMutation({
        mutationFn: ({ customerId, logId, params }) => customerApi.editLog(customerId, logId, params),
        onMutate: () => {
            const toastId = toast.loading("Updating meeting log...");
            return { toastId };
        },
        onSuccess: (data, variables, context) => {
            toast.success("Meeting log updated successfully", { id: context.toastId });
            queryClient.invalidateQueries({ queryKey: qk.customer(variables.customerId) });
        },
        onError: (error, variables, context) => {
            toast.error("Failed to update meeting log", { id: context.toastId });
            logger.error(error, 'useEditCustomerLog');
        }
    });
};

export const useDeleteCustomerLog = () => {
    return useMutation({
        mutationFn: ({ customerId, logId }) => customerApi.deleteLog(customerId, logId),
        onMutate: () => {
            const toastId = toast.loading("Deleting meeting log...");
            return { toastId };
        },
        onSuccess: (data, variables, context) => {
            toast.success("Meeting log deleted successfully", { id: context.toastId });
            queryClient.invalidateQueries({ queryKey: qk.customer(variables.customerId) });
        },
        onError: (error, variables, context) => {
            toast.error("Failed to delete meeting log", { id: context.toastId });
            logger.error(error, 'useDeleteCustomerLog');
        }
    });
};

// ── Profile Picture Mutations ──────────────────────────────────────────────────

export const useAddProfilePic = () => {
    return useMutation({
        mutationFn: ({ id, file }) => customerApi.addProfilePic(id, file),
        onMutate: () => {
            const toastId = toast.loading("Uploading profile picture...");
            return { toastId };
        },
        onSuccess: (data, variables, context) => {
            toast.success("Profile picture uploaded successfully", { id: context.toastId });
            queryClient.invalidateQueries({ queryKey: qk.customer(variables.id) });
            queryClient.invalidateQueries({ queryKey: qk.allCustomers() });
        },
        onError: (error, variables, context) => {
            toast.error("Failed to upload profile picture", { id: context.toastId });
            logger.error(error, 'useAddProfilePic');
        }
    });
};

export const useEditProfilePic = () => {
    return useMutation({
        mutationFn: ({ id, file }) => customerApi.editProfilePic(id, file),
        onMutate: () => {
            const toastId = toast.loading("Updating profile picture...");
            return { toastId };
        },
        onSuccess: (data, variables, context) => {
            toast.success("Profile picture updated successfully", { id: context.toastId });
            queryClient.invalidateQueries({ queryKey: qk.customer(variables.id) });
            queryClient.invalidateQueries({ queryKey: qk.allCustomers() });
        },
        onError: (error, variables, context) => {
            toast.error("Failed to update profile picture", { id: context.toastId });
            logger.error(error, 'useEditProfilePic');
        }
    });
};

export const useDeleteProfilePic = () => {
    return useMutation({
        mutationFn: ({ id }) => customerApi.deleteProfilePic(id),
        onMutate: () => {
            const toastId = toast.loading("Removing profile picture...");
            return { toastId };
        },
        onSuccess: (data, variables, context) => {
            toast.success("Profile picture removed", { id: context.toastId });
            queryClient.invalidateQueries({ queryKey: qk.customer(variables.id) });
            queryClient.invalidateQueries({ queryKey: qk.allCustomers() });
        },
        onError: (error, variables, context) => {
            toast.error("Failed to remove profile picture", { id: context.toastId });
            logger.error(error, 'useDeleteProfilePic');
        }
    });
};

export const useGetDeletedCustomers = () => {
    return useQuery({
        queryKey: qk.deletedCustomers(),
        queryFn: () => customerApi.getDeletedCustomers(),
        staleTime: 2 * 60 * 1000,
        retry: 1,
    });
};

export const useRestoreCustomer = () => {
    return useMutation({
        mutationFn: ({ id }) => customerApi.restoreCustomer(id),
        onMutate: () => {
            const toastId = toast.loading("Restoring contact...");
            return { toastId };
        },
        onSuccess: (data, variables, context) => {
            toast.success("Contact restored successfully", { id: context.toastId });
            queryClient.invalidateQueries({ queryKey: qk.deletedCustomers() });
            queryClient.invalidateQueries({ queryKey: qk.allCustomers() });
            queryClient.invalidateQueries({ queryKey: qk.customerFilterOptions() });
        },
        onError: (error, variables, context) => {
            toast.error("Failed to restore contact", { id: context.toastId });
            logger.error(error, 'useRestoreCustomer');
        }
    });
};

export const usePermanentlyDeleteCustomer = () => {
    return useMutation({
        mutationFn: ({ id }) => customerApi.permanentlyDeleteCustomer(id),
        onMutate: () => {
            const toastId = toast.loading("Permanently deleting contact...");
            return { toastId };
        },
        onSuccess: (data, variables, context) => {
            toast.success("Contact permanently deleted", { id: context.toastId });
            queryClient.invalidateQueries({ queryKey: qk.deletedCustomers() });
        },
        onError: (error, variables, context) => {
            toast.error("Failed to permanently delete contact", { id: context.toastId });
            logger.error(error, 'usePermanentlyDeleteCustomer');
        }
    });
};

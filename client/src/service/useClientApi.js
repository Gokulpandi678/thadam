import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { clientApi } from './api/clientApi';
import { queryClient } from '../utils/queryClient';

const delay = () => new Promise(resolve => setTimeout(resolve, 1000));

export const useGetClientByCustomerId = (customerId) => {
    return useQuery({
        queryKey: ['client', customerId],
        queryFn: () => clientApi.getClientByCustomerId(customerId),
        enabled: !!customerId,
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });
};

export const useGetClient = useGetClientByCustomerId;

export const useGetAllClients = (filterParams = {}) => {
    return useInfiniteQuery({
        queryKey: ['allClients', filterParams],
        queryFn: ({ pageParam = 0 }) =>
            clientApi.getClients({ ...filterParams, page: pageParam }),
        getNextPageParam: (lastPage) => {
            const { currentPage, hasNext } = lastPage.data.result;
            return hasNext ? currentPage + 1 : undefined;
        },
        retry: 1,
    });
};

export const useGetClientFilterOptions = () => {
    return useQuery({
        queryKey: ['clientFilterOptions'],
        queryFn: () => clientApi.getFilterOptions(),
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });
};

export const useConvertAsClient = () => {
    return useMutation({
        mutationFn: async ({ customerId, params }) => {
            await delay();
            return clientApi.convertAsClient(customerId, params);
        },
        onMutate: () => {
            const toastId = toast.loading('Converting to client...');
            return { toastId };
        },
        onSuccess: (data, variables, context) => {
            toast.success('Contact successfully converted to client', { id: context.toastId });
            // Invalidate customer so role updates to "Client" on the detail page
            queryClient.invalidateQueries({ queryKey: ['customer', variables.customerId] });
            queryClient.invalidateQueries({ queryKey: ['allCustomer'] });
            queryClient.invalidateQueries({ queryKey: ['allClients'] });
            queryClient.invalidateQueries({ queryKey: ['clientFilterOptions'] });
        },
        onError: (error, variables, context) => {
            const msg = error?.response?.data?.message ?? 'Failed to convert contact';
            toast.error(msg, { id: context.toastId });
        },
    });
};

export const useUpdateClient = () => {
    return useMutation({
        mutationFn: async ({ customerId, params }) => {
            await delay();
            return clientApi.updateClient(customerId, params);
        },
        onMutate: () => {
            const toastId = toast.loading('Updating client...');
            return { toastId };
        },
        onSuccess: (data, variables, context) => {
            toast.success('Client updated successfully', { id: context.toastId });
            queryClient.invalidateQueries({ queryKey: ['client', variables.customerId] });
            queryClient.invalidateQueries({ queryKey: ['allClients'] });
            queryClient.invalidateQueries({ queryKey: ['clientFilterOptions'] });
        },
        onError: (error, variables, context) => {
            toast.error('Failed to update client', { id: context.toastId });
        },
    });
};

export const useRevertClient = () => {
    return useMutation({
        mutationFn: async ({ customerId }) => {
            await delay();
            return clientApi.revertClient(customerId);
        },
        onMutate: () => {
            const toastId = toast.loading('Reverting to contact...');
            return { toastId };
        },
        onSuccess: (data, variables, context) => {
            toast.success('Client reverted to contact', { id: context.toastId });
            queryClient.invalidateQueries({ queryKey: ['client', variables.customerId] });
            queryClient.invalidateQueries({ queryKey: ['allClients'] });
            queryClient.invalidateQueries({ queryKey: ['customer', variables.customerId] });
            queryClient.invalidateQueries({ queryKey: ['allCustomer'] });
            queryClient.invalidateQueries({ queryKey: ['clientFilterOptions'] });
        },
        onError: (error, variables, context) => {
            toast.error('Failed to revert client', { id: context.toastId });
        },
    });
};

// ── All clients list (for the Clients table page) ─────────────────────────────
// Reuses the existing customers query filtered by role="Client"

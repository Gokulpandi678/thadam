/* eslint-disable react-refresh/only-export-components */
import { createContext, useMemo } from "react";

import useClientFilters from "../hooks/useClientFilters";
import {
    useGetAllClients,
    useGetClientFilterOptions,
    useRevertClient,
    useUpdateClient,
} from "../service/useClientApi";

export const ClientContext = createContext({});

export const ClientContextProvider = ({ children }) => {
    const {
        search, setSearch,
        filters, toggleFilter,
        resetFilters, activeFilterCount,
        queryParams,
    } = useClientFilters();

    const {
        data,
        isError,
        isFetching,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    } = useGetAllClients(queryParams);

    // Flatten pages — identical to CustomerContext
    const clients = useMemo(
        () => data?.pages?.flatMap(page => page.data.result.data) ?? [],
        [data]
    );

    const filterOptionsQuery = useGetClientFilterOptions();
    const filterOptions = useMemo(() => ({
        clientType: filterOptionsQuery.data?.data?.result?.clientTypes ?? [],
        engagementType: filterOptionsQuery.data?.data?.result?.engagementTypes ?? [],
    }), [filterOptionsQuery.data]);

    const updateClientMutation = useUpdateClient();
    const revertClientMutation = useRevertClient();

    const updateClient = (customerId, params) =>
        updateClientMutation.mutate({ customerId, params });

    const revertClient = (customerId, callbacks) =>
        revertClientMutation.mutate({ customerId }, callbacks);

    const values = {
        clients,
        isError,
        isLoading: isFetching && !isFetchingNextPage,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,

        updateClient,
        revertClient,
        isReverting: revertClientMutation.isPending,

        search, setSearch,
        filters, toggleFilter,
        resetFilters, activeFilterCount,
        filterOptions,
    };

    return (
        <ClientContext.Provider value={values}>
            {children}
        </ClientContext.Provider>
    );
};

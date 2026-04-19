import { createContext, useMemo } from "react";
import {
    useGetCustomers,
    useGetCustomerFilterOptions,
    useCreateCustomer,
    useDeleteCustomer,
    useUpdateCustomer
} from "../service/useCustomerApi";
import useCustomerFilters from "../hooks/useCustomerFilters";

export const CustomerContext = createContext({});

export const CustomerContextProvider = ({ children }) => {
    const {
        search,
        setSearch,
        filters,
        toggleFilter,
        resetFilters,
        activeFilterCount,
        queryParams,
    } = useCustomerFilters();

    const {
        data,
        isError,
        isFetching,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    } = useGetCustomers(queryParams);

    const customers = useMemo(
        () => data?.pages?.flatMap(page => page.data.result.data) ?? [],
        [data]
    );

    const filterOptionsQuery = useGetCustomerFilterOptions();
    const filterOptions = useMemo(() => ({
        role: filterOptionsQuery.data?.data?.result?.roles ?? [],
        designation: filterOptionsQuery.data?.data?.result?.designations ?? [],
        city: filterOptionsQuery.data?.data?.result?.cities ?? [],
    }), [filterOptionsQuery.data]);

    const createCustomerMutation = useCreateCustomer();
    const updateCustomerMutation = useUpdateCustomer();
    const deleteCustomerMutation = useDeleteCustomer();

    const createNewCustomer = (params) => createCustomerMutation.mutateAsync(params);
    const updateCustomer = (id, params) => updateCustomerMutation.mutate({ id, params });
    const deleteCustomer = (id, params) => deleteCustomerMutation.mutate({ id, params });

    const values = {
        customers,
        isError,
        isLoading: isFetching && !isFetchingNextPage,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,

        createNewCustomer,
        updateCustomer,
        deleteCustomer,

        search,
        setSearch,
        filters,
        toggleFilter,
        resetFilters,
        activeFilterCount,
        filterOptions,
    };

    return (
        <CustomerContext.Provider value={values}>
            {children}
        </CustomerContext.Provider>
    );
};
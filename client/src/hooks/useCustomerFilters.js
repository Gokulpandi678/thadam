import { useState, useCallback } from "react";
import useDebounce from './useDebounce'

const INITIAL_FILTERS = {
    role: [],
    designation: [],
    city: [],
};

const useCustomerFilters = () => {
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState(INITIAL_FILTERS);

    const debouncedSearch = useDebounce(search, 500);

    const toggleFilter = useCallback((key, value) => {
        setFilters(prev => {
            const current = prev[key];
            const already = current.includes(value);
            return {
                ...prev,
                [key]: already
                    ? current.filter(v => v !== value)
                    : [...current, value],
            };
        });
    }, []);

    const resetFilters = useCallback(() => {
        setSearch("");
        setFilters(INITIAL_FILTERS);
    }, []);

    const activeFilterCount = Object.values(filters).reduce(
        (sum, arr) => sum + arr.length, 0
    );

    const queryParams = {
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
        ...Object.fromEntries(
            Object.entries(filters).filter(([, arr]) => arr.length > 0)
        ),
    };

    return {
        search,
        setSearch,
        filters,
        toggleFilter,
        resetFilters,
        activeFilterCount,
        queryParams,
    };
};

export default useCustomerFilters;

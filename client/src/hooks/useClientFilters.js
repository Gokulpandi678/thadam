import { useState, useMemo, useCallback } from 'react';
import useDebounce from './useDebounce';

// Mirrors useCustomerFilters — same debounce, same queryParams shape
const useClientFilters = () => {
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({
        clientType: [],
        engagementType: [],
    });

    const debouncedSearch = useDebounce(search, 400);

    const toggleFilter = useCallback((key, value) => {
        setFilters(prev => {
            const current = prev[key] ?? [];
            return {
                ...prev,
                [key]: current.includes(value)
                    ? current.filter(v => v !== value)
                    : [...current, value],
            };
        });
    }, []);

    const resetFilters = useCallback(() => {
        setFilters({ clientType: [], engagementType: [] });
        setSearch('');
    }, []);

    const activeFilterCount = useMemo(
        () => Object.values(filters).reduce((sum, arr) => sum + arr.length, 0),
        [filters]
    );

    const queryParams = useMemo(() => ({
        search: debouncedSearch,
        clientType: filters.clientType,
        engagementType: filters.engagementType,
    }), [debouncedSearch, filters]);

    return {
        search, setSearch,
        filters, toggleFilter,
        resetFilters, activeFilterCount,
        queryParams,
    };
};

export default useClientFilters;
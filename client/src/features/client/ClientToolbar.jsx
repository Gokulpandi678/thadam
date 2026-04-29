import { useState, useRef, useEffect, useContext } from "react";
import { Columns3Cog, Filter, Search, X } from "lucide-react";
import { IconButton } from "../../ui/atoms/button/Button";
import InputBox from "../../ui/atoms/input/InputBox";
import { ClientContext } from "../../context/ClientContext";
import FilterDropdown from "../customer/component/table/FilterDropdown";

// Client-specific filter fields — clientType and engagementType
const FILTER_FIELDS = [
    { key: "clientType",     label: "Client type" },
    { key: "engagementType", label: "Engagement" },
];

const ClientToolbar = ({ table, length }) => {
    const [showColumnMenu, setShowColumnMenu] = useState(false);
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    const columnMenuRef = useRef(null);
    const filterMenuRef = useRef(null);

    const {
        search, setSearch,
        filters, toggleFilter,
        resetFilters, activeFilterCount,
        filterOptions,
    } = useContext(ClientContext);

    useEffect(() => {
        const handler = (e) => {
            if (columnMenuRef.current && !columnMenuRef.current.contains(e.target))
                setShowColumnMenu(false);
            if (filterMenuRef.current && !filterMenuRef.current.contains(e.target))
                setShowFilterMenu(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const toggleableColumns = table
        ? table.getAllLeafColumns().filter(col => col.id !== "profile" && col.id !== "actions")
        : [];
    const visibleCount = toggleableColumns.filter(c => c.getIsVisible()).length;

    return (
        <div className="flex justify-between items-center mt-5">
            <div className="flex gap-2 items-center">
                <InputBox
                    placeholder="Search by name, email, company..."
                    icon={<Search />}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    type="search"
                />

                <div className="relative" ref={filterMenuRef}>
                    <IconButton
                        icon={<Filter />}
                        onClick={() => setShowFilterMenu(o => !o)}
                    >
                        Filters
                        {activeFilterCount > 0 && (
                            <span className="ml-1 rounded-full bg-white/20 px-1.5 py-0.5 text-xs">
                                {activeFilterCount}
                            </span>
                        )}
                    </IconButton>

                    {showFilterMenu && (
                        <div className="absolute left-0 z-20 mt-2 w-64 rounded-xl border border-gray-200 bg-white p-3 shadow-xl">
                            <div className="mb-3 flex items-center justify-between">
                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                    Filters
                                </span>
                                {activeFilterCount > 0 && (
                                    <button
                                        onClick={resetFilters}
                                        className="flex items-center gap-1 text-xs text-red-500 hover:underline"
                                    >
                                        <X size={12} /> Clear all
                                    </button>
                                )}
                            </div>

                            <div className="space-y-3">
                                {FILTER_FIELDS.map(({ key, label }) => (
                                    <div key={key}>
                                        <label className="mb-1 block text-xs font-medium text-gray-500">
                                            {label}
                                            {filters[key]?.length > 0 && (
                                                <span className="ml-1.5 rounded-full bg-indigo-100 px-1.5 py-0.5 text-indigo-600">
                                                    {filters[key].length}
                                                </span>
                                            )}
                                        </label>
                                        <FilterDropdown
                                            label={label}
                                            options={filterOptions[key] ?? []}
                                            selected={filters[key] ?? []}
                                            onToggle={(value) => toggleFilter(key, value)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {table && (
                    <div className="relative" ref={columnMenuRef}>
                        <IconButton
                            icon={<Columns3Cog />}
                            onClick={() => setShowColumnMenu(o => !o)}
                        >
                            Columns
                            {visibleCount > 0 && (
                                <span className="ml-1 rounded-full bg-white/20 px-1.5 py-0.5 text-xs">
                                    {visibleCount}
                                </span>
                            )}
                        </IconButton>

                        {showColumnMenu && (
                            <div className="absolute right-0 z-20 mt-2 w-56 rounded-xl border border-gray-200 bg-white p-3 shadow-xl">
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        Toggle Columns ({visibleCount}/{toggleableColumns.length})
                                    </span>
                                    <button
                                        onClick={() => toggleableColumns.forEach(col => col.toggleVisibility(true))}
                                        className="text-xs text-indigo-600 hover:underline"
                                    >
                                        Show all
                                    </button>
                                </div>
                                <div className="max-h-72 overflow-y-auto space-y-1">
                                    {toggleableColumns.map(column => (
                                        <label
                                            key={column.id}
                                            className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={column.getIsVisible()}
                                                onChange={column.getToggleVisibilityHandler()}
                                                className="h-3.5 w-3.5 rounded accent-indigo-600"
                                            />
                                            {column.columnDef.meta?.label ?? column.id}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="flex gap-5 items-center">
                <span className="text-sm text-gray-500">Showing clients: {length}</span>
            </div>
        </div>
    );
};

export default ClientToolbar;
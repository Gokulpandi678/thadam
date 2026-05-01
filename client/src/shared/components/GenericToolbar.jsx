import { useMemo, useRef, useState } from "react";
import { Columns3Cog, Filter, Search, X } from "lucide-react";
import { IconButton } from "../../ui/atoms/button/Button";
import InputBox from "../../ui/atoms/input/InputBox";
import useOutsideClick from "../../hooks/useOutsideClick";
import FilterDropdown from "../../features/customer/components/table/FilterDropdown";

const GenericToolbar = ({
  filterFields,
  filters,
  toggleFilter,
  resetFilters,
  activeFilterCount,
  filterOptions,
  search,
  setSearch,
  table,
  length,
  entityLabel,
  rightSlot = null,
}) => {
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const columnMenuRef = useRef(null);
  const filterMenuRef = useRef(null);

  useOutsideClick(columnMenuRef, () => setShowColumnMenu(false));
  useOutsideClick(filterMenuRef, () => setShowFilterMenu(false));

  const toggleableColumns = useMemo(
    () =>
      table
        ? table.getAllLeafColumns().filter((col) => col.id !== "profile" && col.id !== "actions")
        : [],
    [table]
  );

  const visibleCount = toggleableColumns.filter((column) => column.getIsVisible()).length;

  return (
    <div className="mt-5">
      <div className="flex items-center gap-2 rounded-3xl border border-white/70 bg-white/90 p-3 shadow-sm sm:p-4">
        
        {/* Search — flex-1 always, but capped on desktop */}
        <div className="flex-1 md:max-w-xs lg:max-w-sm">
          <InputBox
            placeholder="Search by name, email, company..."
            icon={<Search />}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            type="search"
          />
        </div>

        {/* Filter button */}
        <div className="relative shrink-0" ref={filterMenuRef}>
          <IconButton
            icon={<Filter />}
            onClick={() => setShowFilterMenu((open) => !open)}
            className="rounded-full px-4 py-2 text-sm shadow-sm"
          >
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="ml-1 rounded-full bg-white/20 px-1.5 py-0.5 text-xs">
                {activeFilterCount}
              </span>
            )}
          </IconButton>

          {showFilterMenu && (
            <div className="absolute right-0 z-20 mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-2xl border border-gray-200 bg-white p-3 shadow-xl">
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
                {filterFields.map(({ key, label }) => (
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

        {/* Columns button */}
        {table && (
          <div className="relative hidden shrink-0 md:block" ref={columnMenuRef}>
            <IconButton
              icon={<Columns3Cog />}
              onClick={() => setShowColumnMenu((open) => !open)}
              className="rounded-full px-4 py-2 text-sm shadow-sm"
            >
              <span className="hidden sm:inline">Columns</span>
              {visibleCount > 0 && (
                <span className="ml-1 rounded-full bg-white/20 px-1.5 py-0.5 text-xs">
                  {visibleCount}
                </span>
              )}
            </IconButton>

            {showColumnMenu && (
              <div className="absolute right-0 z-20 mt-2 w-[min(18rem,calc(100vw-2rem))] rounded-2xl border border-gray-200 bg-white p-3 shadow-xl">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Toggle Columns ({visibleCount}/{toggleableColumns.length})
                  </span>
                  <button
                    onClick={() =>
                      toggleableColumns.forEach((column) => column.toggleVisibility(true))
                    }
                    className="text-xs text-indigo-600 hover:underline"
                  >
                    Show all
                  </button>
                </div>
                <div className="max-h-72 space-y-1 overflow-y-auto">
                  {toggleableColumns.map((column) => (
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

        {/* Count label — hide on mobile to save space */}
        <span className="hidden shrink-0 text-sm text-gray-500 lg:inline">
          {entityLabel}: {length}
        </span>

        {/* Add button — inline on desktop */}
        {rightSlot && (
          <div className="hidden shrink-0 md:block">
            {rightSlot}
          </div>
        )}
      </div>

      {/* Add button — fixed bottom-right on mobile */}
      {rightSlot && (
        <div className="fixed bottom-24 right-4 z-30 md:hidden">
          {rightSlot}
        </div>
      )}
    </div>
  );
};

export default GenericToolbar;

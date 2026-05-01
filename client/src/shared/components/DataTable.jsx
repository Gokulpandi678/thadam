import { flexRender } from "@tanstack/react-table";
import { Loader2, Mail, MapPin, MapPinCheck, Phone } from "lucide-react";
import { NoDataFound } from "../../ui/molecules";

const DataTable = ({
  table,
  isLoading,
  isFetchingNextPage,
  sentinelRef,
  scrollContainerRef,
  toolbar,
  emptyTitle,
  loadingLabel,
  rowActions,
}) => {
  const visibleColumns = table?.getVisibleLeafColumns() ?? [];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {toolbar}
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 className="mr-2 animate-spin" size={20} /> {loadingLabel}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {toolbar}

      <div className="space-y-3 md:hidden">
        {table.getRowModel().rows.length === 0 ? (
          <div className="rounded-[24px] bg-white px-4 py-10 shadow-sm">
            <NoDataFound title={emptyTitle} />
          </div>
        ) : (
          table.getRowModel().rows.map((row) => {
            const cells = row.getVisibleCells();
            const get = (id) => cells.find((c) => c.column.id === id);
            const val = (id) => get(id)?.getValue?.() ?? null;

            const name = get("profile");
            const email = val("primaryEmail");
            const phone = val("primaryContactNo");
            const city = val("addressCity");
            const state = val("addressState");

            return (
              <div
                key={row.id}
                className="rounded-[24px] border border-white/70 bg-white p-4 shadow-sm"
              >
                {/* Top: Name + actions */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    {name && flexRender(name.column.columnDef.cell, name.getContext())}
                  </div>
                  {rowActions && (
                    <div className="flex shrink-0 items-center gap-2">
                      {rowActions(row.original)}
                    </div>
                  )}
                </div>

                {/* Middle: Company, Designation, Role */}
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {["company", "designation", "role"].map((colId) => {
                    const cell = get(colId);
                    if (!cell) return null;
                    return (
                      <div key={colId} className="rounded-xl bg-slate-50 px-2.5 py-1.5">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                          {cell.column.columnDef.meta?.label ?? colId}
                        </p>
                        <p className="mt-0.5 truncate text-xs font-medium text-slate-700">
                          {cell.getValue() || <span className="text-slate-300">—</span>}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom: Email, Phone, Location as icon rows */}
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-slate-100 pt-3">
                  {email && (
                    <a href={`mailto:${email}`} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-400">
                      <Mail size={12} className="shrink-0" />
                      <span className="truncate max-w-[140px]">{email}</span>
                    </a>
                  )}
                  {phone && (
                    <a href={`tel:${phone}`} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-400">
                      <Phone size={12} className="shrink-0" />
                      {phone}
                    </a>
                  )}
                  {(city || state) && (
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <MapPin size={12} className="shrink-0 text-slate-400" />
                      {[city, state].filter(Boolean).join(", ")}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}

        <div ref={sentinelRef} className="h-4 w-full" />
        {isFetchingNextPage && (
          <div className="flex items-center justify-center gap-2 py-4 text-sm text-gray-400">
            <Loader2 className="animate-spin" size={16} /> Loading more...
          </div>
        )}
      </div>

      <div
        ref={scrollContainerRef}
        className="hidden max-h-[calc(100vh-170px)] overflow-auto rounded-[28px] border border-white/70 bg-white shadow-md md:block"
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="sticky top-0 z-10 bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={visibleColumns.length} className="py-20">
                  <div className="flex items-center justify-center">
                    <NoDataFound title={emptyTitle} />
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="group transition-colors duration-100 hover:bg-blue-50/40"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="whitespace-nowrap px-6 py-4 text-sm text-gray-900"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}

                  <td className="sticky right-0 w-0 border-0 bg-transparent p-0">
                    {rowActions ? (
                      <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                        {rowActions(row.original)}
                      </div>
                    ) : null}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div ref={sentinelRef} className="h-4 w-full" />
        {isFetchingNextPage && (
          <div className="flex items-center justify-center gap-2 py-4 text-sm text-gray-400">
            <Loader2 className="animate-spin" size={16} /> Loading more...
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;

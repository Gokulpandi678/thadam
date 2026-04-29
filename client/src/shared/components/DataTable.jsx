import { flexRender } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
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

      <div
        ref={scrollContainerRef}
        className="max-h-[calc(100vh-170px)] overflow-auto rounded-xl shadow-md"
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

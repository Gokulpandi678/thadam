import { useContext, useRef } from "react";
import { flexRender } from "@tanstack/react-table";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import CustomerToolbar from "../component/table/CustomerToolbar";
import useCustomerTable from "../../../hooks/useCustomerTable";
import { CustomerContext } from "../../../context/CustomerContext";
import useIntersectionObserver from "../../../hooks/useIntersectionObserver";

const CustomerTable = ({ onEdit, onDelete }) => {
  const {
    customers,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useContext(CustomerContext);

  const { table } = useCustomerTable(customers);

  const scrollContainerRef = useRef(null);

  const sentinelRef = useIntersectionObserver({
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage && !isFetchingNextPage,
    root: scrollContainerRef,
  });

  const visibleColumns = table?.getVisibleLeafColumns() || [];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <CustomerToolbar table={null} />
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 className="animate-spin mr-2" size={20} /> Loading customers...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <CustomerToolbar table={table} />

      <div
        ref={scrollContainerRef}
        className="overflow-auto shadow-md rounded-xl max-h-[calc(100vh-170px)]"
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id}>
                {hg.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColumns.length + 1}
                  className="px-6 py-12 text-center text-sm text-gray-400"
                >
                  No customers found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr
                  key={row.id}
                  className="group hover:bg-blue-50/40 transition-colors duration-100"
                >
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}

                  <td className="sticky right-0 w-0 p-0 border-0 bg-transparent">
                    <div className="
                      absolute right-2 top-1/2 -translate-y-1/2
                      flex items-center gap-1
                      opacity-0 group-hover:opacity-100
                      transition-opacity duration-150
                    ">
                      <button
                        onClick={() => onEdit(row.original)}
                        className="p-1.5 rounded-md text-white bg-blue-500 hover:text-blue-600 hover:bg-blue-100 transition-colors duration-100 cursor-pointer"
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => onDelete(row.original)}
                        className="p-1.5 rounded-md text-white bg-red-500 hover:text-red-500 hover:bg-red-100 transition-colors duration-100 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
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

export default CustomerTable;
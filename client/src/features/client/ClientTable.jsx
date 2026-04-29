import { useContext, useRef, useMemo, useState } from "react";
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Loader2, Pencil, RotateCcw } from "lucide-react";
import ClientToolbar from "./clientToolbar";
import clientColumns from "./clientColumns";
import { ClientContext } from "../../context/ClientContext";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import NoDataFound from "../../ui/molecules/Empty-state/NoDataFound";

const ClientTable = ({ onEdit, onRevert }) => {
    const {
        clients,
        isLoading,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    } = useContext(ClientContext);

    const [sorting, setSorting] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});

    const data = useMemo(() => clients ?? [], [clients]);
    const columns = useMemo(() => clientColumns(), []);

    const table = useReactTable({
        data,
        columns,
        state: { sorting, columnVisibility },
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const scrollContainerRef = useRef(null);

    const sentinelRef = useIntersectionObserver({
        onIntersect: fetchNextPage,
        enabled: !!hasNextPage && !isFetchingNextPage,
        root: scrollContainerRef,
    });

    const visibleColumns = table?.getVisibleLeafColumns() ?? [];

    if (isLoading) {
        return (
            <div className="flex flex-col gap-4">
                <ClientToolbar table={null} length={clients?.length ?? 0} />
                <div className="flex items-center justify-center py-20 text-gray-400">
                    <Loader2 className="animate-spin mr-2" size={20} /> Loading clients...
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <ClientToolbar table={table} length={clients?.length ?? 0} />

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
                                <td colSpan={visibleColumns.length} className="py-20">
                                    <div className="flex items-center justify-center">
                                        <NoDataFound title="Clients" />
                                    </div>
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
                                                title="Edit client"
                                            >
                                                <Pencil size={15} />
                                            </button>
                                            <button
                                                onClick={() => onRevert(row.original)}
                                                className="p-1.5 rounded-md text-white bg-amber-500 hover:text-amber-600 hover:bg-amber-100 transition-colors duration-100 cursor-pointer"
                                                title="Revert to contact"
                                            >
                                                <RotateCcw size={15} />
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

export default ClientTable;
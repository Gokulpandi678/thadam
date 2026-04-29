import { getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Pencil, RotateCcw } from "lucide-react";
import { useContext, useMemo, useRef, useState } from "react";
import { ClientContext } from "../../../context/ClientContext";
import useIntersectionObserver from "../../../hooks/useIntersectionObserver";
import DataTable from "../../../shared/components/DataTable";
import ClientToolbar from "../components/ClientToolbar";
import clientColumns from "../components/clientColumns";

const ClientTable = ({ onEdit, onRevert }) => {
  const { clients, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useContext(ClientContext);

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

  return (
    <DataTable
      table={table}
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      sentinelRef={sentinelRef}
      scrollContainerRef={scrollContainerRef}
      emptyTitle="Clients"
      loadingLabel="Loading clients..."
      toolbar={<ClientToolbar table={table} length={clients?.length ?? 0} />}
      rowActions={(client) => (
        <>
          <button
            onClick={() => onEdit(client)}
            className="cursor-pointer rounded-md bg-blue-500 p-1.5 text-white transition-colors duration-100 hover:bg-blue-100 hover:text-blue-600"
            title="Edit client"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onRevert(client)}
            className="cursor-pointer rounded-md bg-amber-500 p-1.5 text-white transition-colors duration-100 hover:bg-amber-100 hover:text-amber-600"
            title="Revert to contact"
          >
            <RotateCcw size={15} />
          </button>
        </>
      )}
    />
  );
};

export default ClientTable;

import { Pencil, Trash2 } from "lucide-react";
import { useContext, useRef } from "react";
import { CustomerContext } from "../../../context/CustomerContext";
import useIntersectionObserver from "../../../hooks/useIntersectionObserver";
import useCustomerTable from "../../../hooks/useCustomerTable";
import DataTable from "../../../shared/components/DataTable";
import CustomerToolbar from "../components/table/CustomerToolbar";

const CustomerTable = ({ onEdit, onDelete, onAddClick }) => {
  const { customers, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useContext(CustomerContext);
  const { table } = useCustomerTable(customers);
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
      emptyTitle="Contacts"
      loadingLabel="Loading customers..."
      toolbar={
        <CustomerToolbar table={table} length={customers?.length ?? 0} onAddClick={onAddClick} />
      }
      rowActions={(customer) => (
        <>
          <button
            onClick={() => onEdit(customer)}
            className="cursor-pointer rounded-md bg-blue-500 p-1.5 text-white transition-colors duration-100 hover:bg-blue-100 hover:text-blue-600"
            title="Edit"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(customer)}
            className="cursor-pointer rounded-md bg-red-500 p-1.5 text-white transition-colors duration-100 hover:bg-red-100 hover:text-red-500"
            title="Delete"
          >
            <Trash2 size={15} />
          </button>
        </>
      )}
    />
  );
};

export default CustomerTable;

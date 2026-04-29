import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel
} from "@tanstack/react-table";

import { useMemo, useState } from "react";
import getColumns from "../features/customer/components/table/customerColumns";

const useCustomerTable = (customers) => {
  const data = useMemo(() => customers ?? [], [customers]);
  const [sorting, setSorting] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});

  const columns = useMemo(() => getColumns(), []);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  return { table };
};

export default useCustomerTable;

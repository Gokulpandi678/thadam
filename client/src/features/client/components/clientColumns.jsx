/* eslint-disable react-refresh/only-export-components */
import { createColumnHelper } from "@tanstack/react-table";
import SortIcon from "../../customer/components/table/SortIcon";
import { formatDate } from "../../../utils/customer.utils";
import ClientProfileCell from "./ClientProfileCell";

const columnHelper = createColumnHelper();

const ENGAGEMENT_COLOR_MAP = {
  "Ongoing": "bg-emerald-50 text-emerald-600",
  "One-time": "bg-slate-100 text-slate-500",
  "Contract-based": "bg-amber-50 text-amber-600",
  "As needed": "bg-fuchsia-50 text-fuchsia-600",
};

const SortableHeader = ({ column, label }) => (
  <div
    className="flex items-center gap-1 cursor-pointer hover:text-gray-900"
    onClick={column.getToggleSortingHandler()}
  >
    {label}
    <SortIcon direction={column.getIsSorted()} />
  </div>
);

const clientColumns = () => [
  columnHelper.accessor(
    (row) => `${row.firstName ?? ""} ${row.lastName ?? ""}`.trim(),
    {
      id: "profile",
      meta: { label: "Name" },
      header: ({ column }) => <SortableHeader column={column} label="Name" />,
      cell: ({ row }) => <ClientProfileCell row={row} />,
    }
  ),

  columnHelper.accessor("company", {
    meta: { label: "Company" },
    header: ({ column }) => <SortableHeader column={column} label="Company" />,
    cell: ({ getValue }) => getValue() ?? <span className="text-gray-400">—</span>,
  }),

  columnHelper.accessor("designation", {
    meta: { label: "Designation" },
    header: ({ column }) => <SortableHeader column={column} label="Designation" />,
    cell: ({ getValue }) => getValue() ?? <span className="text-gray-400">—</span>,
  }),

  columnHelper.accessor("clientType", {
    meta: { label: "Client type" },
    header: ({ column }) => <SortableHeader column={column} label="Client type" />,
    cell: ({ getValue }) => (
      <span className="inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600">
        {getValue() ?? "—"}
      </span>
    ),
  }),

  columnHelper.accessor("engagementType", {
    meta: { label: "Engagement" },
    header: ({ column }) => <SortableHeader column={column} label="Engagement" />,
    cell: ({ getValue }) => {
      const val = getValue();
      if (!val) return <span className="text-gray-400">—</span>;
      const colorClass = ENGAGEMENT_COLOR_MAP[val] ?? "bg-slate-100 text-slate-500";
      return (
        <span
          className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${colorClass}`}
        >
          {val}
        </span>
      );
    },
  }),

  columnHelper.accessor("clientSince", {
    meta: { label: "Client since" },
    header: ({ column }) => <SortableHeader column={column} label="Client since" />,
    cell: ({ getValue }) => (
      <span className="text-slate-600 text-[13px]">{formatDate(getValue())}</span>
    ),
  }),

  columnHelper.accessor("nextFollowUp", {
    meta: { label: "Follow-up" },
    header: ({ column }) => <SortableHeader column={column} label="Follow-up" />,
    cell: ({ getValue }) => {
      const val = getValue();
      if (!val) return <span className="text-gray-400">—</span>;
      const isPast = new Date(val) < new Date();
      return (
        <span className={`text-[13px] font-medium ${isPast ? "text-red-500" : "text-slate-600"}`}>
          {formatDate(val)}
        </span>
      );
    },
  }),
];

export default clientColumns;

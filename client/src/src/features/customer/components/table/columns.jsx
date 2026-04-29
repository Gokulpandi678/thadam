/* eslint-disable react-refresh/only-export-components */
import { createColumnHelper } from "@tanstack/react-table";
import { Mail, Phone } from "lucide-react";
import ProfileCell from "./ProfileCell";
import SortIcon from "./SortIcon";

const columnHelper = createColumnHelper();

/**
 * Generates a sortable column header with a sort indicator.
 */
const SortableHeader = ({ column, label }) => (
  <div
    className="flex items-center gap-1 cursor-pointer hover:text-gray-900"
    onClick={column.getToggleSortingHandler()}
  >
    {label}
    <SortIcon direction={column.getIsSorted()} />
  </div>
);

const customerColumns = () => [
  columnHelper.accessor(
    (row) => `${row.firstName ?? ""} ${row.lastName ?? ""}`.trim(),
    {
      id: "profile",
      meta: { label: "Name" },
      header: ({ column }) => <SortableHeader column={column} label="Name" />,
      cell: ({ row }) => <ProfileCell row={row} />,
    }
  ),

  columnHelper.accessor("primaryEmail", {
    meta: { label: "Email" },
    header: ({ column }) => <SortableHeader column={column} label="Email" />,
    cell: ({ getValue }) => {
      const email = getValue();
      if (!email) return <span className="text-gray-400">—</span>;
      return (
        <a
          href={`mailto:${email}`}
          className="flex items-center gap-1.5 text-blue-700 hover:text-blue-500"
        >
          <Mail size={14} className="shrink-0 text-blue-700" />
          {email}
        </a>
      );
    },
  }),

  columnHelper.accessor("primaryContactNo", {
    meta: { label: "Phone" },
    header: ({ column }) => <SortableHeader column={column} label="Phone" />,
    cell: ({ getValue }) => {
      const phone = getValue();
      if (!phone) return <span className="text-gray-400">—</span>;
      return (
        <a
          href={`tel:${phone}`}
          className="flex items-center gap-1.5 text-blue-700 hover:text-indigo-600"
        >
          <Phone size={14} className="shrink-0 text-blue-700" />
          {phone}
        </a>
      );
    },
  }),

  columnHelper.accessor("company", {
    meta: { label: "Company" },
    header: ({ column }) => <SortableHeader column={column} label="Company" />,
  }),

  columnHelper.accessor("designation", {
    meta: { label: "Designation" },
    header: ({ column }) => <SortableHeader column={column} label="Designation" />,
  }),

  columnHelper.accessor("role", {
    meta: { label: "Role" },
    header: ({ column }) => <SortableHeader column={column} label="Role" />,
  }),

  columnHelper.accessor("addressCity", {
    meta: { label: "City" },
    header: ({ column }) => <SortableHeader column={column} label="City" />,
  }),

  columnHelper.accessor("addressState", {
    meta: { label: "State" },
    header: ({ column }) => <SortableHeader column={column} label="State" />,
  }),

  columnHelper.accessor("addressCountry", {
    meta: { label: "Country" },
    header: ({ column }) => <SortableHeader column={column} label="Country" />,
  }),
];

export default customerColumns;

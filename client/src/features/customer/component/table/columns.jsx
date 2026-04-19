import { createColumnHelper } from "@tanstack/react-table";
import ProfileCell from "./ProfileCell";
import SortIcon from "./SortIcon";
import { Mail, Pencil, Phone, Trash } from "lucide-react";

const columnHelper = createColumnHelper();

const columns = (onEdit, onDelete) => [
  columnHelper.accessor(row => `${row.firstName ?? ""} ${row.lastName ?? ""}`.trim(), {
    id: "profile",
    meta: { label: "Name" },
    header: ({ column }) => (
      <div
        className="flex items-center gap-1 cursor-pointer hover:text-gray-900"
        onClick={column.getToggleSortingHandler()}
      >
        Name
        <SortIcon direction={column.getIsSorted()} />
      </div>
    ),
    cell: ({ row }) => <ProfileCell row={row} />,
  }),

  columnHelper.accessor("primaryEmail", {
    meta: { label: "Email" },
    header: ({ column }) => (
      <div
        className="flex items-center gap-1 cursor-pointer hover:text-gray-900"
        onClick={column.getToggleSortingHandler()}
      >
        Email
        <SortIcon direction={column.getIsSorted()} />
      </div>
    ),
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
    header: ({ column }) => (
      <div
        className="flex items-center gap-1 cursor-pointer hover:text-gray-900"
        onClick={column.getToggleSortingHandler()}
      >
        Phone
        <SortIcon direction={column.getIsSorted()} />
      </div>
    ),
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
    header: ({ column }) => (
      <div
        className="flex items-center gap-1 cursor-pointer hover:text-gray-900"
        onClick={column.getToggleSortingHandler()}
      >
        Company
        <SortIcon direction={column.getIsSorted()} />
      </div>
    ),
  }),

  columnHelper.accessor("designation", {
    meta: { label: "Designation" },
    header: ({ column }) => (
      <div
        className="flex items-center gap-1 cursor-pointer hover:text-gray-900"
        onClick={column.getToggleSortingHandler()}
      >
        Designation
        <SortIcon direction={column.getIsSorted()} />
      </div>
    ),
  }),

  columnHelper.accessor("role", {
    meta: { label: "Role" },
    header: ({ column }) => (
      <div
        className="flex items-center gap-1 cursor-pointer hover:text-gray-900"
        onClick={column.getToggleSortingHandler()}
      >
        Role
        <SortIcon direction={column.getIsSorted()} />
      </div>
    ),
  }),

  columnHelper.accessor("addressCity", {
    meta: { label: "City" },
    header: ({ column }) => (
      <div
        className="flex items-center gap-1 cursor-pointer hover:text-gray-900"
        onClick={column.getToggleSortingHandler()}
      >
        City
        <SortIcon direction={column.getIsSorted()} />
      </div>
    ),
  }),

  columnHelper.accessor("addressState", {
    meta: { label: "State" },
    header: ({ column }) => (
      <div
        className="flex items-center gap-1 cursor-pointer hover:text-gray-900"
        onClick={column.getToggleSortingHandler()}
      >
        State
        <SortIcon direction={column.getIsSorted()} />
      </div>
    ),
  }),

  columnHelper.accessor("addressCountry", {
    meta: { label: "Country" },
    header: ({ column }) => (
      <div
        className="flex items-center gap-1 cursor-pointer hover:text-gray-900"
        onClick={column.getToggleSortingHandler()}
      >
        Country
        <SortIcon direction={column.getIsSorted()} />
      </div>
    ),
  }),

  // columnHelper.display({
  //   id: "actions",
  //   meta: { label: "Actions" },
  //   header: "Actions",
  //   cell: ({ row }) => (
  //     <div className="flex gap-2">
  //       <button
  //         onClick={() => onEdit?.(row.original)}
  //         className="text-blue-500 hover:text-blue-800 cursor-pointer"
  //       >
  //         <Pencil size={18} />
  //       </button>
  //       <button
  //         onClick={() => onDelete?.(row.original)}
  //         className="text-red-600 hover:text-red-900 cursor-pointer"
  //       >
  //         <Trash size={18} />
  //       </button>
  //     </div>
  //   ),
  // }),
];

export default columns;
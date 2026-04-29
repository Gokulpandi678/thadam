import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import Avatar from "../../ui/atoms/avatar/Avatar";
import SortIcon from "../customer/component/table/SortIcon";
import { formatDate } from "../../utils/customer.utils";

const columnHelper = createColumnHelper();

const ClientProfileCell = ({ row }) => {
    const navigate = useNavigate();
    const { firstName, lastName, profilePicture, customerId } = row.original;
    const fullName = `${firstName ?? ""} ${lastName ?? ""}`.trim();
    const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

    return (
        <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate(`/customer/${customerId}`)}
        >
            <Avatar src={profilePicture} initials={initials} size={37} />
            <span className="font-medium text-blue-700 hover:text-blue-500">{fullName}</span>
        </div>
    );
};

const clientColumns = () => [
    columnHelper.accessor(
        row => `${row.firstName ?? ""} ${row.lastName ?? ""}`.trim(),
        {
            id: "profile",
            meta: { label: "Name" },
            header: ({ column }) => (
                <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900"
                    onClick={column.getToggleSortingHandler()}>
                    Name <SortIcon direction={column.getIsSorted()} />
                </div>
            ),
            cell: ({ row }) => <ClientProfileCell row={row} />,
        }
    ),

    columnHelper.accessor("company", {
        meta: { label: "Company" },
        header: ({ column }) => (
            <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900"
                onClick={column.getToggleSortingHandler()}>
                Company <SortIcon direction={column.getIsSorted()} />
            </div>
        ),
        cell: ({ getValue }) => getValue() ?? <span className="text-gray-400">—</span>,
    }),

    columnHelper.accessor("designation", {
        meta: { label: "Designation" },
        header: ({ column }) => (
            <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900"
                onClick={column.getToggleSortingHandler()}>
                Designation <SortIcon direction={column.getIsSorted()} />
            </div>
        ),
        cell: ({ getValue }) => getValue() ?? <span className="text-gray-400">—</span>,
    }),

    columnHelper.accessor("clientType", {
        meta: { label: "Client type" },
        header: ({ column }) => (
            <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900"
                onClick={column.getToggleSortingHandler()}>
                Client type <SortIcon direction={column.getIsSorted()} />
            </div>
        ),
        cell: ({ getValue }) => (
            <span className="inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600">
                {getValue() ?? "—"}
            </span>
        ),
    }),

    columnHelper.accessor("engagementType", {
        meta: { label: "Engagement" },
        header: ({ column }) => (
            <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900"
                onClick={column.getToggleSortingHandler()}>
                Engagement <SortIcon direction={column.getIsSorted()} />
            </div>
        ),
        cell: ({ getValue }) => {
            const val = getValue();
            if (!val) return <span className="text-gray-400">—</span>;
            const colorMap = {
                "Ongoing":        "bg-emerald-50 text-emerald-600",
                "One-time":       "bg-slate-100 text-slate-500",
                "Contract-based": "bg-amber-50 text-amber-600",
                "As needed":      "bg-fuchsia-50 text-fuchsia-600",
            };
            return (
                <span className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${colorMap[val] ?? "bg-slate-100 text-slate-500"}`}>
                    {val}
                </span>
            );
        },
    }),

    columnHelper.accessor("clientSince", {
        meta: { label: "Client since" },
        header: ({ column }) => (
            <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900"
                onClick={column.getToggleSortingHandler()}>
                Client since <SortIcon direction={column.getIsSorted()} />
            </div>
        ),
        cell: ({ getValue }) => (
            <span className="text-slate-600 text-[13px]">{formatDate(getValue())}</span>
        ),
    }),

    columnHelper.accessor("nextFollowUp", {
        meta: { label: "Follow-up" },
        header: ({ column }) => (
            <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900"
                onClick={column.getToggleSortingHandler()}>
                Follow-up <SortIcon direction={column.getIsSorted()} />
            </div>
        ),
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
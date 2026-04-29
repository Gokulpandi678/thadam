import { Trash2, RotateCcw, Mail, Briefcase, Phone } from "lucide-react";
import { dayAgo, getFullName, getInitials } from "../../../utils/customer.utils";
import { Avatar } from "../../../ui/atoms";
import { TABLE_AVATAR_SIZE } from "../../../shared/constants/ui";

const DeletedContactCard = ({ customer, onRestore, onDelete }) => {
  if (!customer) return null;

  const company = customer.company;
  const designation = customer.designation;
  const email = customer.primaryEmail;
  const phone = customer.primaryContactNo;
  const meta = [company, designation].filter(Boolean).join(" · ");
  const daysAgo = dayAgo(customer.updatedAt ?? "");

  return (
    <div
      className="grid items-center gap-4 px-4 py-3 bg-white border border-gray-100 rounded-xl hover:border-gray-200 transition-colors"
      style={{ gridTemplateColumns: `${TABLE_AVATAR_SIZE}px 1fr 1fr 1fr 1fr auto` }}
    >
      <Avatar src={customer.profilePicture} initials={getInitials(customer)} size={TABLE_AVATAR_SIZE} />

      <span className="text-sm font-medium text-gray-900 truncate">{getFullName(customer)}</span>

      <span className="flex items-center gap-1.5 text-xs text-gray-500 truncate">
        {meta ? (
          <>
            <Briefcase size={11} className="shrink-0 text-gray-500" />
            <span className="truncate">{meta}</span>
          </>
        ) : (
          <span className="text-gray-500">—</span>
        )}
      </span>

      <span className="flex items-center gap-1.5 text-xs text-gray-500 truncate">
        {email ? (
          <>
            <Mail size={11} className="shrink-0 text-gray-500" />
            <span className="truncate">{email}</span>
          </>
        ) : (
          <span className="text-gray-500">—</span>
        )}
      </span>

      <span className="flex items-center gap-1.5 text-xs text-gray-500 truncate">
        {phone ? (
          <>
            <Phone size={11} className="shrink-0 text-gray-500" />
            <span className="truncate">{phone}</span>
          </>
        ) : (
          <span className="text-gray-500">—</span>
        )}
      </span>

      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-[11px] text-red-700 bg-red-50 rounded-full px-2 py-0.5 shrink-0">
          {daysAgo}
        </span>
        <button
          onClick={() => onRestore(customer)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-800 text-xs font-medium cursor-pointer hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
        >
          <RotateCcw size={12} />
          Restore
        </button>
        <button
          onClick={() => onDelete(customer)}
          className="w-8 h-8 rounded-lg border border-red-100 bg-red-50 flex items-center justify-center text-red-700 cursor-pointer hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
};

export default DeletedContactCard;

import { useNavigate } from "react-router-dom";
import { Avatar } from "../../../../ui/atoms";
import { TABLE_AVATAR_SIZE } from "../../../../shared/constants/ui";
import { getInitials } from "../../../../utils/customer.utils";

const ProfileCell = ({ row }) => {
  const { firstName, lastName } = row.original;
  const fullName = `${firstName ?? ""} ${lastName ?? ""}`.trim();
  const navigate = useNavigate();

  return (
    <div
      className="flex items-center gap-3 cursor-pointer"
      onClick={() => navigate(`/customer/${row.original.id}`)}
    >
      <Avatar
        src={row.original.profilePicture}
        initials={getInitials(row.original)}
        size={TABLE_AVATAR_SIZE}
      />
      <span className="font-medium text-blue-700 hover:text-blue-500">{fullName}</span>
    </div>
  );
};

export default ProfileCell;

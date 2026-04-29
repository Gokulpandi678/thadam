import { useNavigate } from "react-router-dom";
import Avatar from "../../../../ui/atoms/avatar/Avatar";
import { getInitials } from "../../../../utils/customer.utils";

const ProfileCell = ({ row }) => {
  const { firstName, lastName } = row.original;
  const fullName = `${firstName ?? ""} ${lastName ?? ""}`.trim();
  const navigate = useNavigate();

  const handleNavigate = () => navigate(`/customer/${row.original.id}`)

  return (
    <div className="flex items-center gap-3 cursor-pointer" onClick={handleNavigate}>
      <Avatar 
        src={row.original.profilePicture}
        initials={getInitials(row.original)}
        size={37}
      />
      <span className="font-medium text-blue-700 hover:text-blue-500">{fullName}</span>
    </div>
  );
};

export default ProfileCell;
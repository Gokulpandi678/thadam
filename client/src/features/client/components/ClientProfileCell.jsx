import { useNavigate } from "react-router-dom";
import { Avatar } from "../../../ui/atoms";
import { TABLE_AVATAR_SIZE } from "../../../shared/constants/ui";

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
      <Avatar src={profilePicture} initials={initials} size={TABLE_AVATAR_SIZE} />
      <span className="font-medium text-blue-700 hover:text-blue-500">{fullName}</span>
    </div>
  );
};

export default ClientProfileCell;

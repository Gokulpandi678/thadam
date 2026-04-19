import { useNavigate } from "react-router-dom";

const ProfileCell = ({ row }) => {
  const { firstName, lastName, profilePicture } = row.original;
  const fullName = `${firstName ?? ""} ${lastName ?? ""}`.trim();
  const navigate = useNavigate();

  const handleNavigate = () => navigate(`/customer/${row.original.id}`)

  return (
    <div className="flex items-center gap-3 cursor-pointer" onClick={handleNavigate}>
      {profilePicture ? (
        <img
          src={profilePicture}
          alt={fullName}
          className="w-8 h-8 rounded-full object-cover"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-sm font-medium text-gray-600">
            {firstName?.[0]?.toUpperCase()}{lastName?.[0]?.toUpperCase()}
          </span>
        </div>
      )}
      <span className="font-medium text-blue-700 hover:text-blue-500">{fullName}</span>
    </div>
  );
};

export default ProfileCell;
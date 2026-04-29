import { useState } from "react";
import { LayoutDashboard, Users, Settings, LogOut, Trash2, UserCheck } from "lucide-react";
import SideBarLink from "./SideBarLink";
import images from "../../../assets";
import { useLogoutUser } from "../../../service/useAuthApi";
import { ConfirmationModal } from "../../../shared/components";

const SIDEBAR_LINKS = [
  { name: "Contacts", path: "/", icon: Users },
  { name: "Clients", path: "/clients", icon: UserCheck },
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Recycle Bin", path: "/recycle-bin", icon: Trash2 },
];

const SideBar = () => {
  const { mutate: logout, isPending } = useLogoutUser();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <>
      <aside className="flex flex-col items-stretch h-screen w-18 bg-white border-gray-100 py-4 z-10 shadow-sm">
        <div className="mb-8 w-13 ml-2.5">
          <img src={images.logo} alt="Thadam CRM Logo" />
        </div>

        <nav className="flex flex-col items-center gap-5 flex-1">
          {SIDEBAR_LINKS.map((link) => (
            <SideBarLink key={link.name} {...link} />
          ))}
        </nav>

        <div className="flex flex-col items-center gap-2 pb-4">
          <SideBarLink name="Settings" path="/settings" icon={Settings} />
          <SideBarLink
            name="Logout"
            icon={LogOut}
            onClick={() => setShowLogoutModal(true)}
            disabled={isPending}
          />
        </div>
      </aside>

      <ConfirmationModal
        isOpen={showLogoutModal}
        title="Confirm logout"
        message="Are you sure you want to log out? Any unsaved changes will be lost."
        confirmLabel="Logout"
        onConfirm={() => {
          logout();
          setShowLogoutModal(false);
        }}
        onCancel={() => setShowLogoutModal(false)}
        isLoading={isPending}
        variant="danger"
        icon={<LogOut />}
      />
    </>
  );
};

export default SideBar;

import { useState } from "react";
import { LayoutDashboard, LogOut, Settings, Trash2, UserCheck, Users } from "lucide-react";
import images from "../../assets";
import { ConfirmationModal } from "../../shared/components";
import { useLogoutUser } from "../../service/useAuthApi";
import SideBarLink from "./SideBarLink";

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
      <aside className="z-10 flex h-screen w-18 flex-col items-stretch border-gray-100 bg-white py-4 shadow-sm">
        <div className="mb-8 ml-2.5 w-13">
          <img src={images.logo} alt="Thadam CRM Logo" />
        </div>

        <nav className="flex flex-1 flex-col items-center gap-5">
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

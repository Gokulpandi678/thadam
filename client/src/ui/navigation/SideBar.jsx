import { useState } from "react";
import { LayoutDashboard, LogOut, Settings, Trash2, UserCheck, Users } from "lucide-react";
import images from "../../assets";
import { ConfirmationModal } from "../../shared/components";
import { useLogoutUser } from "../../service/useAuthApi";
import SideBarLink from "./SideBarLink";

const NAV_LINKS = [
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
      {/* ── MOBILE: Logout floating top-right ── */}
      <div className="fixed top-3 right-3 z-50 md:hidden">
        <SideBarLink
          name="Logout"
          icon={LogOut}
          onClick={() => setShowLogoutModal(true)}
          disabled={isPending}
          floating
        />
      </div>

      {/* ── MOBILE: bottom bar (4 nav + Settings) ── */}
      <aside className="fixed inset-x-3 bottom-3 z-40 rounded-[28px] border border-white/70
          bg-white/95 px-2 py-2 shadow-[0_20px_45px_rgba(15,23,42,0.16)] backdrop-blur
          md:hidden">
        <nav className="flex items-center justify-around gap-2">
          {NAV_LINKS.map((link) => (
            <SideBarLink key={link.name} {...link} />
          ))}
          <SideBarLink name="Settings" path="/settings" icon={Settings} />
        </nav>
      </aside>

      {/* ── DESKTOP: left sidebar ── */}
      <aside className="hidden bg-white    md:sticky md:top-0 md:flex md:h-screen md:w-22 md:flex-col
          md:border-r md:border-white md:py-4 md:shadow-sm">
        <div className="mb-8 ml-2.5 w-13">
          <img src={images.logo} alt="Thadam CRM Logo" />
        </div>

        {/* Main nav links */}
        <nav className="flex flex-1 flex-col items-center gap-5">
          {NAV_LINKS.map((link) => (
            <SideBarLink key={link.name} {...link} />
          ))}
        </nav>

        {/* Settings + Logout pinned at bottom */}
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
        onConfirm={() => { logout(); setShowLogoutModal(false); }}
        onCancel={() => setShowLogoutModal(false)}
        isLoading={isPending}
        variant="danger"
        icon={<LogOut />}
      />
    </>
  );
};

export default SideBar;
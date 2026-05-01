import { useLocation } from "react-router-dom";
import { SideBar } from "../navigation";

const MainLayout = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="flex min-h-screen bg-slate-100">
      {!isLoginPage && <SideBar />}
      <main
        className={`flex-1 overflow-y-auto ${isLoginPage ? "p-0" : "px-3 pb-28 pt-4 sm:px-5 sm:pt-5 md:px-6 md:pb-6"}`}
      >
        <div className={isLoginPage ? "" : "mx-auto w-full max-w-[1600px]"}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;

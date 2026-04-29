import { useLocation } from "react-router-dom";
import { SideBar } from "../navigation";

const MainLayout = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="flex h-screen overflow-hidden">
      {!isLoginPage && <SideBar />}
      <main className={`flex-1 overflow-y-auto py-3 px-4 ${isLoginPage ? "p-0" : ""}`}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;

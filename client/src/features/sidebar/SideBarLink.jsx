import { NavLink } from "react-router-dom";
import clsx from "clsx";

const baseClass =
  "group flex flex-col items-center justify-center rounded-xl transition-colors duration-150 text-xs p-1";

const SideBarLink = ({ name, path, icon: Icon, onClick }) => {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={clsx(baseClass, "text-gray-400 hover:text-red-500 w-full cursor-pointer")}
      >
        <Icon size={18} />
        <span className="font-medium py-1">{name}</span>
      </button>
    );
  }

  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        clsx(
          baseClass,
          isActive
            ? "text-blue-500 bg-blue-50"
            : "text-gray-400 hover:text-blue-500"
        )
      }
    >
      <Icon size={18} />
      <span className="font-medium py-1">{name}</span>
    </NavLink>
  );
};

export default SideBarLink;
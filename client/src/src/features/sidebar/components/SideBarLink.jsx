import { NavLink } from "react-router-dom";
import clsx from "clsx";

const BASE_CLASS =
  "group flex flex-col items-center justify-center rounded-xl transition-colors duration-150 text-xs p-1";

const SideBarLink = ({ name, path, icon: Icon, onClick, disabled }) => {
  const NavIcon = Icon;

  if (onClick) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={clsx(BASE_CLASS, "text-gray-400 hover:text-red-500 w-full cursor-pointer disabled:opacity-50")}
      >
        <NavIcon size={18} />
        <span className="font-medium py-1">{name}</span>
      </button>
    );
  }

  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        clsx(
          BASE_CLASS,
          isActive ? "text-blue-500 bg-blue-50" : "text-gray-400 hover:text-blue-500"
        )
      }
    >
      <NavIcon size={18} />
      <span className="font-medium py-1">{name}</span>
    </NavLink>
  );
};

export default SideBarLink;

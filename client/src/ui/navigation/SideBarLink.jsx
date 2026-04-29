import clsx from "clsx";
import { NavLink } from "react-router-dom";

const BASE_CLASS =
  "group flex flex-col items-center justify-center rounded-xl p-1 text-xs transition-colors duration-150";

const SideBarLink = ({ name, path, icon: Icon, onClick, disabled }) => {
  const NavIcon = Icon;

  if (onClick) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={clsx(
          BASE_CLASS,
          "w-full cursor-pointer text-gray-400 hover:text-red-500 disabled:opacity-50"
        )}
      >
        <NavIcon size={18} />
        <span className="py-1 font-medium">{name}</span>
      </button>
    );
  }

  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        clsx(
          BASE_CLASS,
          isActive ? "bg-blue-50 text-blue-500" : "text-gray-400 hover:text-blue-500"
        )
      }
    >
      <NavIcon size={18} />
      <span className="py-1 font-medium">{name}</span>
    </NavLink>
  );
};

export default SideBarLink;

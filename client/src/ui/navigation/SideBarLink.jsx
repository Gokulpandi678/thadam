import clsx from "clsx";
import { NavLink } from "react-router-dom";

const BASE_CLASS =
  "group flex min-w-0 flex-1 flex-col items-center justify-center rounded-2xl px-2 py-2 text-[10px] transition-colors duration-150 sm:text-[11px] md:w-full md:flex-none md:px-1 md:py-1 md:text-xs";

const SideBarLink = ({ name, path, icon: Icon, onClick, disabled }) => {
  const NavIcon = Icon;

  if (onClick) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={clsx(
          BASE_CLASS,
          "cursor-pointer text-gray-400 hover:text-red-500 disabled:opacity-50 md:w-full"
        )}
      >
        <NavIcon size={18} />
        <span className="truncate pt-1 font-medium">{name}</span>
      </button>
    );
  }

  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        clsx(
          BASE_CLASS,
          isActive
            ? "bg-blue-50 text-blue-500 shadow-sm"
            : "text-gray-400 hover:bg-slate-50 hover:text-blue-500"
        )
      }
    >
      <NavIcon size={18} />
      <span className="truncate pt-1 font-medium">{name}</span>
    </NavLink>
  );
};

export default SideBarLink;

import clsx from "clsx";
import { NavLink } from "react-router-dom";

const SideBarLink = ({ name, path, icon: Icon, onClick, disabled, floating }) => {
  const base = clsx(
    "group flex min-w-0 items-center justify-center rounded-2xl transition-colors duration-150 font-medium",
    floating
      ? "flex-row gap-1.5 rounded-full border border-red-100 bg-white/95 px-3 py-2 text-[10px] text-red-400 shadow-[0_4px_14px_rgba(15,23,42,0.12)] backdrop-blur hover:border-red-200 hover:text-red-500"
      : "w-full flex-col px-1 py-1 text-xs"
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={clsx(base, !floating && "text-gray-400 hover:text-red-500 disabled:opacity-50")}
      >
        <Icon size={floating ? 14 : 18} />
        <span className={clsx("truncate", floating ? "" : "pt-0.5")}>{name}</span>
      </button>
    );
  }

  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        clsx(
          base,
          !floating && (isActive
            ? "bg-blue-50 text-blue-500 shadow-sm"
            : "text-gray-400 hover:bg-slate-50 hover:text-blue-500"
          )
        )
      }
    >
      <Icon size={floating ? 14 : 18} />
      <span className={clsx("truncate", !floating && "pt-0.5")}>{name}</span>
    </NavLink>
  );
};

export default SideBarLink;
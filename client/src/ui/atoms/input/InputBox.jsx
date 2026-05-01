import clsx from "clsx";
import React from "react";

const ICON_SIZE = 18;

const InputBox = ({ placeholder, onChange, value, icon, type = "text" }) => {
  return (
    <div
      className={clsx(
        "flex w-full items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-500 shadow-sm",
        "focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100"
      )}
    >
      {icon && React.cloneElement(icon, { size: ICON_SIZE })}
      <input
        className="w-full border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 sm:text-[15px]"
        type={type}
        onChange={onChange}
        value={value}
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputBox;

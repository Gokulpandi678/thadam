import clsx from "clsx";
import React from "react";

const ICON_SIZE = 18;

const InputBox = ({ placeholder, onChange, value, icon, type = "text" }) => {
  return (
    <div
      className={clsx(
        "flex items-center gap-1 border-2 border-gray-600 text-gray-600 w-max",
        "rounded py-1 px-2"
      )}
    >
      {icon && React.cloneElement(icon, { size: ICON_SIZE })}
      <input
        className="border-none outline-none w-70"
        type={type}
        onChange={onChange}
        value={value}
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputBox;

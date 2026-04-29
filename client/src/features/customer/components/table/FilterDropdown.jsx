import { Check, ChevronDown } from "lucide-react";
import { useRef, useState } from "react";
import useOutsideClick from "../../../../hooks/useOutsideClick";

const FilterDropdown = ({ label, options, selected, onToggle }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useOutsideClick(ref, () => setOpen(false));

  const selectedLabel =
    selected.length === 0
      ? `All ${label}s`
      : selected.length === 1
        ? selected[0]
        : `${selected.length} selected`;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm text-gray-700 hover:border-indigo-400 focus:outline-none"
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown
          size={14}
          className={`ml-1 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 z-30 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
          {options.length === 0 ? (
            <p className="px-3 py-2 text-xs text-gray-400">No options available</p>
          ) : (
            <ul className="max-h-48 overflow-y-auto py-1">
              {options.map((option) => {
                const isSelected = selected.includes(option);
                return (
                  <li
                    key={option}
                    onClick={() => onToggle(option)}
                    className="flex cursor-pointer items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                        isSelected ? "border-indigo-600 bg-indigo-600" : "border-gray-300"
                      }`}
                    >
                      {isSelected && <Check size={10} color="white" strokeWidth={3} />}
                    </span>
                    {option}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;

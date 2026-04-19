import { useState, useRef, useEffect } from "react";

import {ChevronDown, ChevronUp} from 'lucide-react'
import { useCustomRoles } from "../../../../hooks/useCustomerRoles";

const RoleSelect = ({ value, onChange, error }) => {
    const { roles, addRole, removeRole } = useCustomRoles();
    const [open, setOpen]   = useState(false);
    const [input, setInput] = useState("");
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (!ref.current?.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const filtered = roles.filter(r =>
        r.toLowerCase().includes(input.toLowerCase())
    );

    const canAdd = input.trim() !== "" && 
        roles.every(role => role.toLowerCase() !== input.trim().toLowerCase());


    const select = (role) => {
        onChange("role", role);
        setInput("");
        setOpen(false);
    };

    const handleAdd = () => {
        const trimmed = input.trim();
        if (!trimmed) return;
        addRole(trimmed);
        select(trimmed);
    };

    const handleKey = (e) => {
        if (e.key === "Enter" && canAdd) handleAdd();
        // if (e.key === "Escape") setOpen(false);
    };

    return (
        <div className="flex flex-col gap-1" ref={ref}>
            <label className="text-sm text-gray-500">Role</label>
            <div className="relative">
                <input
                    value={open ? input : value}
                    placeholder="Select or type a role..."
                    onClick={() => setOpen(prev => !prev)}  
                    onChange={(e) => { setInput(e.target.value); setOpen(true); }}
                    onKeyDown={handleKey}
                    className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 cursor-pointer ${
                        error ? "border-red-400" : "border-gray-200"
                    }`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">
                    {open ? <ChevronUp /> : <ChevronDown />}
                </span>

                {open && (
                    <div className="absolute z-10 w-full bg-white border border-gray-200 rounded shadow-md mt-1 max-h-48 overflow-y-auto">
                        {filtered.map(role => (
                            <div
                                key={role}
                                className="flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer group"
                                onClick={() => select(role)}
                                onMouseDown={(e) => e.preventDefault()}
                            >
                                <span className={value === role ? "text-blue-500 font-medium" : ""}>
                                    {role}
                                </span>
                                <span
                                    className="text-xs text-gray-300 group-hover:text-gray-400 opacity-0 group-hover:opacity-100"
                                    onClick={(e) => { 
                                        e.stopPropagation(); 
                                        removeRole(role); 
                                    }}
                                >
                                    ✕
                                </span>
                            </div>
                        ))}

                        {canAdd && (
                            <div
                                className="flex items-center gap-2 px-3 py-2 text-sm text-blue-500 hover:bg-blue-50 cursor-pointer border-t border-gray-100"
                                onClick={handleAdd}
                                onMouseDown={(e) => e.preventDefault()} 
                            >
                                <span className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-xs">+</span>
                                Add "{input.trim()}"
                            </div>
                        )}

                        {roles.length === 0 && !canAdd && (
                            <p className="px-3 py-2 text-xs text-gray-400">
                                No roles yet — type to add one
                            </p>
                        )}
                    </div>
                )}
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
};

export default RoleSelect;
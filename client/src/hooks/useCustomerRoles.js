import { useState } from "react";

const STORAGE_KEY = "crm_custom_roles";

export const useCustomRoles = () => {
    const [roles, setRoles] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        } catch {
            return [];
        }
    });

    const addRole = (newRole) => {
        const trimmed = newRole.trim();
        if (!trimmed) return;
        setRoles(prev => {
            if (prev.includes(trimmed)) return prev;
            const updated = [...prev, trimmed];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    };

    const removeRole = (role) => {
        setRoles(prev => {
            const updated = prev.filter(r => r !== role);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    };

    return { 
        roles, 
        addRole, 
        removeRole 
    };
};
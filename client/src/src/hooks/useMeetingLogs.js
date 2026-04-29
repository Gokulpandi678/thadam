import { useState } from "react";

const DEFAULT_LOG = {
    type: "",
    description: "",
    duration: "",
    date: new Date().toISOString().split("T")[0],
};

export const useMeetingLogs = () => {
    const [log, setLog] = useState({ ...DEFAULT_LOG });
    const [errors, setErrors] = useState({});

    const handleChange = (key, value) => {
        setLog(prev => ({ ...prev, [key]: value }));
        if (errors[key]) setErrors(prev => ({ ...prev, [key]: "" }));
    };

    const validate = () => {
        const newErrors = {};
        if (!log.type)        
            newErrors.type  = "Select a meeting type";
        if (!log.description.trim()) 
            newErrors.description = "Notes are required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const getLogsPayload = () => {
        if (!log.type && !log.description.trim()) 
            return undefined;
        if (!validate()) 
            return null;
        return [{ ...log }];
    };

    const reset = () => {
        setLog({ ...DEFAULT_LOG });
        setErrors({});
    };

    return { 
        log, 
        errors, 
        handleChange, 
        getLogsPayload, 
        reset
    };
};
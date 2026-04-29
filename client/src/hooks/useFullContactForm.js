/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";

// profilePicture is intentionally excluded from form state.
// It is managed independently via useAddProfilePic / useEditProfilePic / useDeleteProfilePic.
const DEFAULT_FORM = {
    firstName: "",
    lastName: "",
    primaryEmail: "",
    secondaryEmail: "",
    primaryContactNo: "",
    secondaryContactNo: "",
    role: "",
    designation: "",
    company: "",
    addressStreet: "",
    addressNumber: "",
    addressPostcode: "",
    addressCity: "",
    addressState: "",
    addressCountry: "",
    socialLinkedin: "",
    socialTwitter: "",
    socialYoutube: "",
    lastContactedDate: "",
    referredBy: "",
    logs: []
};

export const useFullContactForm = (initialData = {}) => {
    const [form, setForm] = useState({ ...DEFAULT_FORM, ...initialData });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setForm({ ...DEFAULT_FORM, ...initialData });
        setErrors({});
    }, [initialData?.id]);

    const handleChange = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
        if (errors[key])
            setErrors(prev => ({ ...prev, [key]: "" }));
    };

    const validate = () => {
        const newErrors = {};
        if (!form.firstName.trim()) newErrors.firstName = "First name is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const getPayload = () =>
        Object.fromEntries(Object.entries(form).filter(([, v]) => v !== ""));

    const reset = () => {
        setForm({ ...DEFAULT_FORM, ...initialData });
        setErrors({});
    };

    return {
        form,
        errors,
        handleChange,
        validate,
        getPayload,
        reset
    };
};

import { useState, useEffect } from "react";

const EMPTY_FORM = {
    /* Personal */
    firstName: "",
    lastName: "",
    primaryEmail: "",
    secondaryEmail: "",
    primaryContactNo: "",
    secondaryContactNo: "",
    referredBy: "",
    lastContactedDate: "",

    /* Work */
    company: "",
    designation: "",
    role: "",
    socialLinkedin: "",
    socialTwitter: "",
    socialYoutube: "",

    /* Address */
    addressStreet: "",
    addressNumber: "",
    addressCity: "",
    addressState: "",
    addressPostcode: "",
    addressCountry: "",

    /* Client */
    clientType: "Freelance client",
    clientSince: new Date().toISOString().split("T")[0],
    conversionReason: "",
    valueTags: [],
    engagementType: "Ongoing",
    nextFollowUp: "",
    notes: "",
};

function normalise(raw) {
    if (!raw) return EMPTY_FORM;
    return {
        ...EMPTY_FORM,
        ...raw,
        valueTags: Array.isArray(raw.valueTags)
            ? raw.valueTags
            : typeof raw.valueTags === "string" && raw.valueTags
                ? raw.valueTags.split(",")
                : [],
        lastContactedDate: raw.lastContactedDate ?? "",
        clientSince: raw.clientSince ?? new Date().toISOString().split("T")[0],
        nextFollowUp: raw.nextFollowUp ?? "",
    };
}

export function useContactDrawerForm(initial, isOpen) {
    const [form, setForm] = useState(() => normalise(initial));
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            setForm(normalise(initial));
            setErrors({});
        }
    }, [isOpen, initial]);

    const onChange = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
        if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
    };

    const validate = () => {
        const next = {};
        if (!form.firstName?.trim()) next.firstName = "First name is required";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const serialise = () => ({
        ...form,
        valueTags: form.valueTags.join(",") || null,
        clientSince: form.clientSince || null,
        nextFollowUp: form.nextFollowUp || null,
        conversionReason: form.conversionReason || null,
        notes: form.notes || null,
        secondaryEmail: form.secondaryEmail || null,
        secondaryContactNo: form.secondaryContactNo || null,
        lastContactedDate: form.lastContactedDate || null,
        addressStreet: form.addressStreet || null,
        addressNumber: form.addressNumber || null,
        addressCity: form.addressCity || null,
        addressState: form.addressState || null,
        addressPostcode: form.addressPostcode || null,
        addressCountry: form.addressCountry || null,
    });

    return { 
        form, 
        errors, 
        onChange, 
        validate, 
        serialise 
    };
}
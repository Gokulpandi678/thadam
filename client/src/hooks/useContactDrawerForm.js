/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";

const CLIENT_FIELDS = [
    "clientType",
    "clientSince",
    "conversionReason",
    "valueTags",
    "engagementType",
    "nextFollowUp",
    "notes",
];

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

    /* Meeting */
    meetingType: "",
    meetingDate: "",
    meetingDuration: "",
    meetingDescription: "",
};

function normalise(raw) {
    if (!raw) return EMPTY_FORM;
    const clientData = raw.client ?? raw;

    return {
        ...EMPTY_FORM,
        ...raw,
        ...Object.fromEntries(CLIENT_FIELDS.map((key) => [key, clientData[key]])),
        valueTags: Array.isArray(clientData.valueTags)
            ? clientData.valueTags
            : typeof clientData.valueTags === "string" && clientData.valueTags
                ? clientData.valueTags.split(",")
                : [],
        lastContactedDate: raw.lastContactedDate ?? "",
        clientSince: clientData.clientSince ?? new Date().toISOString().split("T")[0],
        nextFollowUp: clientData.nextFollowUp ?? "",
    };
}

const getClientPayload = (form) => ({
    clientType: form.clientType || null,
    clientSince: form.clientSince || null,
    conversionReason: form.conversionReason || null,
    valueTags: form.valueTags.join(",") || null,
    engagementType: form.engagementType || null,
    nextFollowUp: form.nextFollowUp || null,
    notes: form.notes || null,
});

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

    const getMeetingLogPayload = () => {
        const meetingFields = {
            type: form.meetingType?.trim(),
            date: form.meetingDate?.trim(),
            duration: form.meetingDuration?.trim(),
            description: form.meetingDescription?.trim(),
        };

        const hasMeetingData = Object.values(meetingFields).some(Boolean);
        if (!hasMeetingData) return false;

        const nextErrors = {};
        if (!meetingFields.type) nextErrors.meetingType = "Meeting type is required";
        if (!meetingFields.date) nextErrors.meetingDate = "Meeting date is required";
        if (!meetingFields.duration) nextErrors.meetingDuration = "Meeting duration is required";
        if (!meetingFields.description) {
            nextErrors.meetingDescription = "Meeting description is required";
        }

        if (Object.keys(nextErrors).length > 0) {
            setErrors((prev) => ({ ...prev, ...nextErrors }));
            return false;
        }

        return [
            {
                type: meetingFields.type,
                date: meetingFields.date,
                duration: meetingFields.duration,
                description: meetingFields.description,
            },
        ];
    };

    const serialise = () => {
        const baseForm = { ...form };
        delete baseForm.meetingType;
        delete baseForm.meetingDate;
        delete baseForm.meetingDuration;
        delete baseForm.meetingDescription;

        return {
            ...baseForm,
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
        };
    };

    const serialiseCustomerUpdate = () => {
        const baseForm = serialise();

        CLIENT_FIELDS.forEach((key) => {
            delete baseForm[key];
        });

        if (form.role === "Client") {
            baseForm.client = getClientPayload(form);
        }

        return baseForm;
    };

    return { 
        form, 
        errors, 
        onChange, 
        validate, 
        serialise,
        serialiseCustomerUpdate,
        getMeetingLogPayload,
    };
}

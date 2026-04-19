import React from 'react';
import { formatDate } from '../../../../utils/customer.utils';

const Field = ({ label, value }) => {
    const lowerLabel = label.toLowerCase();

    const isEmail = lowerLabel.includes("email");
    const isPhone = lowerLabel.includes("phone");

    const href = isEmail ? `mailto:${value}` : isPhone ? `tel:${value}` : null;

    return (
        <div>
            <p className="text-xs uppercase tracking-[0.6px] text-slate-400 font-medium mb-1">
                {label}
            </p>

            {href ? (
                <a
                    className="text-sm font-semibold text-blue-500"
                    href={href}
                >
                    {value ?? "—"}
                </a>
            ) : (
                <p className="text-sm font-semibold text-slate-700">
                    {value ?? "—"}
                </p>
            )}
        </div>
    );
};

const SectionLabel = ({ children }) => (
    <p className="text-sm font-bold tracking-[0.8px] uppercase text-slate-500 mb-3 mt-5 first:mt-0">
        {children}
    </p>
);

const AdditionalDetails = ({ customer }) => {
    if (!customer) return null;

    const fullAddress = [
        customer.addressNumber && customer.addressStreet
            ? `${customer.addressNumber}, ${customer.addressStreet}`
            : customer.addressStreet || customer.addressNumber,
        customer.addressCity,
        customer.addressState,
        customer.addressPostcode,
        customer.addressCountry,
    ].filter(Boolean).join(', ');

    return (
        <div className="flex flex-col gap-4 bg-white rounded-[20px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">

            <div className="grid grid-cols-3 gap-5">
                    <Field label="Designation" value={customer.designation} />
                    <Field label="Company" value={customer.company} />
                    <Field label="Role" value={customer.role} />
                    <Field label="Secondary Email" value={customer.secondaryEmail} />
                    <Field label="Secondary Phone" value={customer.secondaryContactNo} />
                    <Field label="Last Contacted" value={formatDate(customer.lastContactedDate)} />
                    {fullAddress && <Field label="Full Address" value={fullAddress}/>}
                    
            </div>
    
        </div>
    );
};

export default AdditionalDetails;
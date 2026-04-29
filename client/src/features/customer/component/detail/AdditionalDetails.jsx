import { useState } from 'react';
import { formatDate } from '../../../../utils/customer.utils';
import DetailTabStrip from './DetailTabStrip';
import ClientProfileCard from './ClientProfileCard';
import MeetingHistory from './MeetingHistory';

/**
 * Field — single label + value cell
 */
const Field = ({ label, value }) => {
    const lower = label.toLowerCase();
    const isEmail = lower.includes("email");
    const isPhone = lower.includes("phone");
    const href = isEmail ? `mailto:${value}` : isPhone ? `tel:${value}` : null;

    return (
        <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium mb-1">
                {label}
            </p>
            {href ? (
                <a href={href} className="text-[13px] font-semibold text-blue-500 hover:underline">
                    {value ?? "—"}
                </a>
            ) : (
                <p className="text-[13px] font-semibold text-slate-700">{value ?? "—"}</p>
            )}
        </div>
    );
};

/**
 * SectionLabel — small uppercase divider inside a tab panel
 */
const SectionLabel = ({ children }) => (
    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mt-5 mb-3 first:mt-0">
        {children}
    </p>
);

/**
 * AdditionalDetails
 * ─────────────────
 * Replaces the old flat card. Now shows a tab strip:
 *   • Contact  — always visible
 *   • Client   — only when customer has clientType (i.e. is a client)
 *   • Meetings — always visible (delegates to MeetingHistory)
 */
const AdditionalDetails = ({ customer, onLogMeeting }) => {
    const isClient = !!customer?.clientType;

    const tabs = [
        { key: "contact",  label: "Contact" },
        ...(isClient ? [{ key: "client", label: "Client" }] : []),
        { key: "meetings", label: "Meetings", count: customer?.logs?.length ?? 0 },
    ];

    const [activeTab, setActiveTab] = useState("contact");

    if (!customer) return null;

    const fullAddress = [
        customer.addressNumber && customer.addressStreet
            ? `${customer.addressNumber}, ${customer.addressStreet}`
            : customer.addressStreet || customer.addressNumber,
        customer.addressCity,
        customer.addressState,
        customer.addressPostcode,
        customer.addressCountry,
    ].filter(Boolean).join(", ");

    return (
        <div className="bg-white rounded-[20px] px-6 pt-5 pb-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">

            <DetailTabStrip tabs={tabs} active={activeTab} onChange={setActiveTab} />

            {/* ── Contact tab ── */}
            {activeTab === "contact" && (
                <div>
                    <SectionLabel>Work</SectionLabel>
                    <div className="grid grid-cols-3 gap-5">
                        <Field label="Company"    value={customer.company} />
                        <Field label="Designation" value={customer.designation} />
                        <Field label="Role"        value={customer.role} />
                    </div>

                    <SectionLabel>Contact</SectionLabel>
                    <div className="grid grid-cols-3 gap-5">
                        <Field label="Secondary Email" value={customer.secondaryEmail} />
                        <Field label="Secondary Phone" value={customer.secondaryContactNo} />
                        <Field label="Last Contacted"  value={formatDate(customer.lastContactedDate)} />
                    </div>

                    {fullAddress && (
                        <>
                            <SectionLabel>Address</SectionLabel>
                            <div className="grid grid-cols-3 gap-5">
                                <Field label="Full Address" value={fullAddress} />
                            </div>
                        </>
                    )}

                    {customer.referredBy && (
                        <>
                            <SectionLabel>Other</SectionLabel>
                            <div className="grid grid-cols-3 gap-5">
                                <Field label="Referred By" value={customer.referredBy} />
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* ── Client tab (only rendered when isClient) ── */}
            {activeTab === "client" && isClient && (
                <ClientProfileCard customer={customer} />
            )}

            {/* ── Meetings tab ── */}
            {activeTab === "meetings" && (
                <MeetingHistory
                    customer={customer}
                    onLogMeeting={onLogMeeting}
                    embedded          // tells MeetingHistory to drop its own card wrapper
                />
            )}
        </div>
    );
};

export default AdditionalDetails;
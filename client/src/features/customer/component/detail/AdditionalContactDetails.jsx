import { formatDate } from '../../../../utils/customer.utils';

const Field = ({ label, value }) => {
    const lower = label.toLowerCase();
    const isEmail = lower.includes("email");
    const isPhone = lower.includes("phone");
    const href = isEmail ? `mailto:${value}` : isPhone ? `tel:${value}` : null;

    return (
        <div>
            <p className="text-xs uppercase tracking-[0.6px] text-slate-400 font-medium mb-1">
                {label}
            </p>
            {href ? (
                <a href={href} className="text-sm font-semibold text-blue-500 hover:underline">
                    {value ?? "—"}
                </a>
            ) : (
                <p className="text-sm font-semibold text-slate-700">{value ?? "—"}</p>
            )}
        </div>
    );
};

const SectionLabel = ({ children }) => (
    <p className="text-sm font-bold tracking-[0.8px] uppercase text-slate-500 mb-3 mt-5 first:mt-0">
        {children}
    </p>
);

const Pill = ({ label }) => (
    <span className="text-[12px] px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 font-medium">
        {label}
    </span>
);


const AdditionalDetails = ({ customer, clientOnly = false }) => {
    console.log(customer, clientOnly)
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

    const valueTags = Array.isArray(customer.valueTags)
        ? customer.valueTags
        : typeof customer.valueTags === "string" && customer.valueTags
            ? customer.valueTags.split(",").filter(Boolean)
            : [];

    return (
        <div className="flex flex-col gap-4 bg-white rounded-[20px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">

            {/* ── Basic Info (hidden when clientOnly) ── */}
            {!clientOnly && (
                <div className="grid grid-cols-3 gap-5">
                    <Field label="Designation"     value={customer.designation} />
                    <Field label="Company"         value={customer.company} />
                    <Field label="Role"            value={customer.role} />
                    <Field label="Secondary Email" value={customer.secondaryEmail} />
                    <Field label="Secondary Phone" value={customer.secondaryContactNo} />
                    <Field label="Last Contacted"  value={formatDate(customer.lastContactedDate)} />
                    {fullAddress  && <Field label="Full Address" value={fullAddress} />}
                    {customer.referredBy && <Field label="Referred By" value={customer.referredBy} />}
                </div>
            )}

            {/* ── Client fields (shown in clientOnly tab OR inline when scrolling basic info) ── */}
            {customer.clientType && (
                <div className={clientOnly ? "" : "border-t border-slate-100 pt-4"}>
                    {!clientOnly && <SectionLabel>Client Details</SectionLabel>}
                    <div className="grid grid-cols-3 gap-5">
                        <Field label="Client Type"    value={customer.clientType} />
                        <Field label="Client Since"   value={formatDate(customer.clientSince)} />
                        <Field label="Engagement"     value={customer.engagementType} />
                        <Field label="Next Follow-up" value={formatDate(customer.nextFollowUp)} />
                        {customer.conversionReason && (
                            <Field label="How They Became a Client" value={customer.conversionReason} />
                        )}
                    </div>

                    {valueTags.length > 0 && (
                        <div className="mt-4">
                            <SectionLabel>What They Bring</SectionLabel>
                            <div className="flex flex-wrap gap-2">
                                {valueTags.map(tag => <Pill key={tag} label={tag} />)}
                            </div>
                        </div>
                    )}

                    {customer.notes && (
                        <div className="mt-4">
                            <SectionLabel>Notes</SectionLabel>
                            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                                {customer.notes}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdditionalDetails;
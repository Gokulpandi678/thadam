import { formatDate } from '../../../../utils/customer.utils';
import { CalendarDays, RefreshCw, Clock, StickyNote, Zap } from 'lucide-react';

/**
 * ClientProfileCard
 * Shown only when customer.role === "Client" (or data has clientType).
 * Receives the full merged customer+client response object.
 */

const Pill = ({ label }) => (
    <span className="text-[12px] px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 font-medium">
        {label}
    </span>
);

const StatBlock = ({ icon: Icon, label, value, iconBg, iconColor }) => (
    <div className="flex items-start gap-3">
        <div
            className="w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0 mt-0.5"
            style={{ background: iconBg }}
        >
            <Icon size={14} style={{ color: iconColor }} />
        </div>
        <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium mb-0.5">
                {label}
            </p>
            <p className="text-[13px] font-semibold text-slate-700">
                {value ?? "—"}
            </p>
        </div>
    </div>
);

const ClientProfileCard = ({ customer }) => {
    const tags = Array.isArray(customer.valueTags)
        ? customer.valueTags
        : typeof customer.valueTags === "string" && customer.valueTags
            ? customer.valueTags.split(",").filter(Boolean)
            : [];

    return (
        <div className="flex flex-col gap-6">

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-5">
                <StatBlock
                    icon={CalendarDays}
                    label="Client since"
                    value={formatDate(customer.clientSince)}
                    iconBg="#eff6ff"
                    iconColor="#2563eb"
                />
                <StatBlock
                    icon={RefreshCw}
                    label="Engagement"
                    value={customer.engagementType}
                    iconBg="#f0fdfa"
                    iconColor="#0d9488"
                />
                <StatBlock
                    icon={Clock}
                    label="Next follow-up"
                    value={formatDate(customer.nextFollowUp)}
                    iconBg="#fffbeb"
                    iconColor="#d97706"
                />
                <StatBlock
                    icon={Zap}
                    label="Client type"
                    value={customer.clientType}
                    iconBg="#fdf4ff"
                    iconColor="#9333ea"
                />
            </div>

            {/* How they became a client */}
            {customer.conversionReason && (
                <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium mb-2">
                        How they became a client
                    </p>
                    <p className="text-[13px] text-slate-600 leading-relaxed bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                        {customer.conversionReason}
                    </p>
                </div>
            )}

            {/* Value tags */}
            {tags.length > 0 && (
                <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium mb-2.5">
                        What they bring
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {tags.map(tag => <Pill key={tag} label={tag} />)}
                    </div>
                </div>
            )}

            {/* Notes */}
            {customer.notes && (
                <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium mb-2">
                        Notes
                    </p>
                    <div className="flex gap-2.5 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                        <StickyNote size={14} className="text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-[13px] text-slate-600 leading-relaxed">
                            {customer.notes}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientProfileCard;
import { formatDate } from "../../../../utils/customer.utils";
import { CalendarDays, RefreshCw, Clock, StickyNote, Zap } from "lucide-react";

const Pill = ({ label }) => (
  <span className="text-[12px] px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 font-medium">
    {label}
  </span>
);

const StatBlock = ({ icon: Icon, label, value, iconBg, iconColor }) => {
  const StatIcon = Icon;

  return (
  <div className="flex items-start gap-3">
    <div
      className="w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0 mt-0.5"
      style={{ background: iconBg }}
    >
      <StatIcon size={14} style={{ color: iconColor }} />
    </div>
    <div>
      <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium mb-0.5">
        {label}
      </p>
      <p className="text-[13px] font-semibold text-slate-700">{value ?? "—"}</p>
    </div>
  </div>
  );
};

const parseValueTags = (valueTags) => {
  if (Array.isArray(valueTags)) return valueTags;
  if (typeof valueTags === "string" && valueTags)
    return valueTags.split(",").filter(Boolean);
  return [];
};

const ClientProfileCard = ({ customer }) => {
  const tags = parseValueTags(customer?.client?.valueTags);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-5">
        <StatBlock
          icon={CalendarDays}
          label="Client since"
          value={formatDate(customer?.client?.clientSince)}
          iconBg="#eff6ff"
          iconColor="#2563eb"
        />
        <StatBlock
          icon={RefreshCw}
          label="Engagement"
          value={customer?.client?.engagementType}
          iconBg="#f0fdfa"
          iconColor="#0d9488"
        />
        <StatBlock
          icon={Clock}
          label="Next follow-up"
          value={formatDate(customer?.client?.nextFollowUp)}
          iconBg="#fffbeb"
          iconColor="#d97706"
        />
        <StatBlock
          icon={Zap}
          label="Client type"
          value={customer?.client?.clientType}
          iconBg="#fdf4ff"
          iconColor="#9333ea"
        />
      </div>

      {customer?.client?.conversionReason && (
        <div>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium mb-2">
            How they became a client
          </p>
          <p className="text-[13px] text-slate-600 leading-relaxed bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
            {customer?.client?.conversionReason}
          </p>
        </div>
      )}

      {tags.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium mb-2.5">
            What they bring
          </p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Pill key={tag} label={tag} />
            ))}
          </div>
        </div>
      )}

      {customer?.client?.notes && (
        <div>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium mb-2">
            Notes
          </p>
          <div className="flex gap-2.5 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
            <StickyNote size={14} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[13px] text-slate-600 leading-relaxed">{customer?.client?.notes}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientProfileCard;

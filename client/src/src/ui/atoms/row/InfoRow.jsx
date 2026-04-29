const InfoRow = ({ icon, label, value, href, iconBg = '#eff4ff', iconColor = '#2563eb' }) => {
  if (!value) return null;

  return (
    <div className="flex items-start gap-2.5">
      <div
        style={{ background: iconBg, color: iconColor }}
        className="w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0"
      >
        {icon}
      </div>

      <div className="flex flex-col gap-px min-w-0">
        <span className="text-[10px] uppercase tracking-[0.6px] text-slate-400 font-medium">
          {label}
        </span>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] text-blue-600 no-underline truncate"
          >
            {value}
          </a>
        ) : (
          <span className="text-[13px] text-slate-900 truncate">
            {value}
          </span>
        )}
      </div>
    </div>
  );
};

export default InfoRow;
const DetailTabStrip = ({ tabs, active, onChange }) => (
  <div className="flex gap-1 border-b border-slate-100 mb-5">
    {tabs.map((tab) => (
      <button
        key={tab.key}
        type="button"
        onClick={() => onChange(tab.key)}
        className={`flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-medium border-b-2 -mb-px transition-colors cursor-pointer ${
          active === tab.key
            ? "text-blue-600 border-blue-600"
            : "text-slate-400 border-transparent hover:text-slate-600"
        }`}
      >
        {tab.label}
        {tab.count !== undefined && (
          <span
            className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
              active === tab.key ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-400"
            }`}
          >
            {tab.count}
          </span>
        )}
      </button>
    ))}
  </div>
);

export default DetailTabStrip;

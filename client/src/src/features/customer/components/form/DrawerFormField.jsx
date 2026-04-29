const DrawerFormField = ({ label, value, onChange, type = "text", error, required, placeholder, options }) => {
    const baseInput = `w-full text-[13px] border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors ${
        error ? "border-red-400 bg-red-50/40" : "border-slate-200 bg-white"
    }`;

    return (
        <div className="flex flex-col gap-1">
            <label className="text-[11px] text-slate-500">
                {label}
                {required && <span className="text-red-400 ml-0.5">*</span>}
            </label>

            {type === "select" ? (
                <select
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    className={baseInput}
                >
                    {options?.map(opt =>
                        typeof opt === "string"
                            ? <option key={opt} value={opt}>{opt}</option>
                            : <option key={opt.value} value={opt.value}>{opt.label}</option>
                    )}
                </select>
            ) : type === "textarea" ? (
                <textarea
                    rows={2}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`${baseInput} resize-none`}
                />
            ) : (
                <input
                    type={type}
                    value={value ?? ""}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={baseInput}
                />
            )}

            {error && <p className="text-[11px] text-red-500">{error}</p>}
        </div>
    );
};

export default DrawerFormField;
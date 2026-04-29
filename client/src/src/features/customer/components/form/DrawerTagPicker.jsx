const DrawerTagPicker = ({ label, options, selected, onChange }) => {
    const toggle = (tag) =>
        onChange(
            selected.includes(tag)
                ? selected.filter(t => t !== tag)
                : [...selected, tag]
        );

    return (
        <div className="flex flex-col gap-2">
            {label && <label className="text-[11px] text-slate-500">{label}</label>}
            <div className="flex flex-wrap gap-1.5">
                {options.map(tag => (
                    <button
                        key={tag}
                        type="button"
                        onClick={() => toggle(tag)}
                        className={`text-[12px] px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                            selected.includes(tag)
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600"
                        }`}
                    >
                        {tag}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default DrawerTagPicker;
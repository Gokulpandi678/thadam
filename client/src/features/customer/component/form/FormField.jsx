const FormField = ({ label, value, onChange, type = "text", error, required }) => (
    <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-600">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`border rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 ${error ? "border-red-400" : "border-gray-300"}`}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
);

export default FormField;
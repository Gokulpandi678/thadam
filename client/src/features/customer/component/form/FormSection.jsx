const FormSection = ({ title, children }) => (
    <div className="flex flex-col gap-3 p-4 shadow-[0_0_6px_rgba(0,0,0,0.12)] rounded">
        <h4 className="text-sm font-medium text-gray-700 uppercase tracking-widest">
            {title}
        </h4>
        <div className="grid grid-cols-2 gap-3">
            {children}
        </div>
    </div>
);

export default FormSection;
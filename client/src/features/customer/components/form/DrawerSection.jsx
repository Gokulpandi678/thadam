import DrawerFormField from "./DrawerFormField";
import DrawerTagPicker from "./DrawerTagPicker";
import RoleSelect from "./RoleSelect";

const DrawerSection = ({ section, form, errors, onChange }) => {
  const cols = section.columns ?? 2;
  const gridClass = cols === 1 ? "flex flex-col gap-3" : "grid grid-cols-2 gap-3";

  return (
    <div className="flex flex-col gap-3">
      {section.title && (
        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">
          {section.title}
        </p>
      )}
      <div className={gridClass}>
        {section.fields.map((field) => {
          const isFullSpan = field.span === "full" || field.type === "textarea";
          const wrapClass = isFullSpan && cols === 2 ? "col-span-2" : "";

          if (field.type === "roleselect") {
            return (
              <div key={field.key} className={wrapClass || "col-span-2"}>
                <RoleSelect
                  value={form[field.key] ?? ""}
                  onChange={onChange}
                  error={errors?.[field.key]}
                />
              </div>
            );
          }

          if (field.type === "tags") {
            return (
              <div key={field.key} className={wrapClass || "col-span-2"}>
                <DrawerTagPicker
                  label={field.label}
                  options={field.options ?? []}
                  selected={form[field.key] ?? []}
                  onChange={(val) => onChange(field.key, val)}
                />
              </div>
            );
          }

          return (
            <div key={field.key} className={wrapClass}>
              <DrawerFormField
                label={field.label}
                type={field.type ?? "text"}
                value={form[field.key] ?? ""}
                onChange={(val) => onChange(field.key, val)}
                error={errors?.[field.key]}
                required={field.required}
                placeholder={field.placeholder}
                options={field.options}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DrawerSection;

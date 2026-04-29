import { useEffect } from "react";
import { X, UserCheck, Save, User } from "lucide-react";
import DrawerForm from "./DrawerForm";
import contactDrawerTabs from "./contactDrawerConfig";

const ContactDrawer = ({
    isOpen,
    onClose,
    mode = "add",
    form,
    errors = {},
    onChange,
    onSubmit,
    isPending = false,
    contact = null,
    tabs,
    submitLabel,
}) => {
    useEffect(() => {
        const handler = e => { if (e.key === "Escape") onClose(); };
        if (isOpen) document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const isEdit = mode === "edit";
    const initials = contact
        ? `${contact.firstName?.[0] ?? ""}${contact.lastName?.[0] ?? ""}`.toUpperCase()
        : null;
    const fullName = contact
        ? `${contact.firstName ?? ""} ${contact.lastName ?? ""}`.trim()
        : null;

    const defaultLabel = isEdit ? "Save changes" : "Save contact";
    const ctaLabel = submitLabel ?? defaultLabel;

    const activeTabs = tabs ?? contactDrawerTabs;

    return (
        <div
            className="fixed inset-0 z-50 flex justify-end bg-black/40"
            onClick={onClose}
        >
            <div
                className="relative flex flex-col w-full max-w-130 h-full bg-white shadow-xl"
                onClick={e => e.stopPropagation()}
            >
                {/* ── Header ── */}
                <div className="bg-blue-600 px-6 py-5 flex items-center gap-3 shrink-0">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                        {initials ?? <User />}
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="text-white text-[15px] font-semibold leading-tight truncate">
                            {isEdit ? `Edit contact — ${fullName}` : "New contact"}
                        </p>
                        {isEdit && contact && (
                            <p className="text-blue-200 text-[12px] truncate">
                                {[contact.designation, contact.company, contact.role]
                                    .filter(Boolean)
                                    .join(" · ")}
                            </p>
                        )}
                        {!isEdit && (
                            <p className="text-blue-200 text-[12px]">
                                Fill in the details below
                            </p>
                        )}
                    </div>

                    <button
                        onClick={onClose}
                        className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors cursor-pointer shrink-0"
                    >
                        <X size={15} />
                    </button>
                </div>

                <DrawerForm
                    tabs={activeTabs}
                    form={form}
                    errors={errors}
                    onChange={onChange}
                />

                <div className="px-6 py-4 border-t border-slate-100 flex gap-2 shrink-0">
                    <button
                        onClick={onSubmit}
                        disabled={isPending}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white text-[13px] font-medium py-2.5 rounded-xl hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isEdit ? <Save size={15} /> : <UserCheck size={15} />}
                        {isPending ? "Saving..." : ctaLabel}
                    </button>
                    <button
                        onClick={onClose}
                        disabled={isPending}
                        className="px-5 py-2.5 text-[13px] text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContactDrawer;
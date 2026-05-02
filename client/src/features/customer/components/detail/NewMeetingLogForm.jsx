// import { useEffect, useState } from "react";
// import { X, Calendar } from "lucide-react";
// import MeetingLogForm from "../form/MeetingLogForm";

// const INITIAL_FORM = { type: "", date: "", duration: "", description: "" };

// const normaliseForm = (initialForm) => ({
//   type: initialForm?.type ?? "",
//   date: initialForm?.date ?? "",
//   duration: initialForm?.duration ?? "",
//   description: initialForm?.description ?? "",
// });

// const NewMeetingLogForm = ({
//   isOpen,
//   onClose,
//   onSubmit,
//   initialForm = INITIAL_FORM,
//   title = "Log Meeting",
//   submitLabel = "Log Meeting",
//   isPending = false,
// }) => {
//   const [form, setForm] = useState(() => normaliseForm(initialForm));
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     if (!isOpen) return;
//     setForm(normaliseForm(initialForm));
//     setErrors({});
//   }, [initialForm, isOpen]);

//   if (!isOpen) return null;

//   const handleChange = (key, val) => {
//     setForm((prev) => ({ ...prev, [key]: val }));
//     if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
//   };

//   const handleSubmit = async () => {
//     const e = {};
//     if (!form.type) e.type = "Select a meeting type";
//     if (!form.date) e.date = "Date is required";
//     if (Object.keys(e).length) return setErrors(e);
//     try {
//       const result = await onSubmit?.(form);
//       if (result === false) return;
//       setForm(INITIAL_FORM);
//       onClose();
//     } catch {
//       return false;
//     }
//   };

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
//       onClick={(e) => e.target === e.currentTarget && onClose()}
//     >
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
//         {/* Header */}
//         <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
//               <Calendar size={16} className="text-blue-600" />
//             </div>
//             <h2 className="text-[15px] font-bold text-slate-900">{title}</h2>
//           </div>
//           <button
//             onClick={onClose}
//             className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
//           >
//             <X size={16} />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="px-6 py-5">
//           <MeetingLogForm form={form} errors={errors} onChange={handleChange} variant="modal" />
//         </div>

//         {/* Footer */}
//         <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50">
//           <button
//             onClick={onClose}
//             disabled={isPending}
//             className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-[13px] font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={isPending}
//             className="px-5 py-2 rounded-xl bg-blue-600 text-white text-[13px] font-medium hover:bg-blue-700 transition-colors cursor-pointer shadow-[0_2px_8px_rgba(37,99,235,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
//           >
//             {isPending ? "Saving..." : submitLabel}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NewMeetingLogForm;


import { useEffect, useState } from "react";
import { X, Calendar } from "lucide-react";
import MeetingLogForm from "../form/MeetingLogForm";

const INITIAL_FORM = { type: "", date: "", duration: "", description: "" };

const normaliseForm = (initialForm) => ({
  type: initialForm?.type ?? "",
  date: initialForm?.date ?? "",
  duration: initialForm?.duration ?? "",
  description: initialForm?.description ?? "",
});

const NewMeetingLogForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialForm = INITIAL_FORM,
  title = "Log Meeting",
  submitLabel = "Log Meeting",
  isPending = false,
}) => {
  const [form, setForm] = useState(() => normaliseForm(initialForm));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) return;
    setForm(normaliseForm(initialForm));
    setErrors({});
  }, [initialForm, isOpen]);

  if (!isOpen) return null;

  const handleChange = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const handleSubmit = async () => {
    const e = {};
    if (!form.type) e.type = "Select a meeting type";
    if (!form.date) e.date = "Date is required";
    if (Object.keys(e).length) return setErrors(e);
    try {
      const result = await onSubmit?.(form);
      if (result === false) return;
      setForm(INITIAL_FORM);
      onClose();
    } catch {
      return false;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg sm:mx-4 overflow-hidden">
        {/* Drag handle — mobile only */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-9 h-1 rounded-full bg-slate-200" />
        </div>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Calendar size={16} className="text-blue-600" />
            </div>
            <h2 className="text-[15px] font-bold text-slate-900">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <MeetingLogForm form={form} errors={errors} onChange={handleChange} variant="modal" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50">
          <button
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-[13px] font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="px-5 py-2 rounded-xl bg-blue-600 text-white text-[13px] font-medium hover:bg-blue-700 transition-colors cursor-pointer shadow-[0_2px_8px_rgba(37,99,235,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? "Saving..." : submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewMeetingLogForm;
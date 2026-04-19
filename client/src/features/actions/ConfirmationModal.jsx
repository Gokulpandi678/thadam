import { InfoIcon } from "lucide-react";
import { useEffect } from "react";

const ConfirmationModal = ({
  isOpen,
  onConfirm,
  onCancel,
  title = "Are you sure?",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  isLoading = false,
  icon = <InfoIcon />
}) => {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onCancel(); };
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-xl border border-gray-200 p-6 w-80 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2.5 mb-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0
            ${variant === "danger" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"}`}>
            {icon}
          </div>
          <h2 className="text-sm font-medium text-gray-900">{title}</h2>
        </div>

        {message && (
          <p className="text-xs text-gray-500 mb-5 leading-relaxed font-semibold">{message}</p>
        )}

        <div className="flex gap-2 justify-end mt-4">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-1.5 text-xs rounded-lg font-medium transition-colors cursor-pointer
              ${variant === "danger"
                ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                : "bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100"
              } disabled:opacity-50`}
          >
            {isLoading ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
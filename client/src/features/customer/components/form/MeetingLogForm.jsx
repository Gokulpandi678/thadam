/* eslint-disable react-refresh/only-export-components */
import { Phone, Users, Mail, MapPin, Video } from "lucide-react";

export const MEETING_TYPES = [
  { value: "CALL", label: "Call", emoji: "📞", icon: <Phone size={13} /> },
  { value: "INPERSON", label: "In-person", emoji: "🤝", icon: <Users size={13} /> },
  { value: "ONLINEMEETING", label: "Online Call", emoji: "🎥", icon: <Video size={13} /> },
  { value: "EMAIL", label: "Email", emoji: "📧", icon: <Mail size={13} /> },
  { value: "SITEVISIT", label: "Site Visit", emoji: "📍", icon: <MapPin size={13} /> },
];

const MeetingLogForm = ({ form, errors = {}, onChange, variant = "modal" }) => {
  const isModal = variant === "modal";

  const labelClass = `block mb-2 font-semibold uppercase tracking-[0.6px] ${
    isModal ? "text-[11px] text-slate-400" : "text-xs text-gray-500"
  }`;
  const meetingTypeButtonClass = (value) =>
    `transition-all duration-150 cursor-pointer font-medium ${
      isModal
        ? `flex flex-col items-center gap-1 rounded-xl border-[1.5px] px-2 py-3 text-[12px] ${
            form.type === value
              ? "border-blue-600 bg-blue-50 text-blue-600"
              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
          }`
        : `flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm ${
            form.type === value
              ? "border-blue-500 bg-blue-500 text-white"
              : "border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:text-blue-500"
          }`
    }`;
  const dateInputClass = `w-full px-3 py-2.5 text-[13px] outline-none transition-colors ${
    isModal
      ? `rounded-xl border ${
          errors.date
            ? "border-red-400 bg-red-50"
            : "border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white"
        }`
      : `rounded border ${errors.date ? "border-red-400" : "border-gray-200 focus:border-blue-400"}`
  }`;
  const durationInputClass = `w-full px-3 py-2.5 text-[13px] outline-none transition-colors ${
    isModal
      ? "rounded-xl border border-slate-200 bg-slate-50 placeholder:text-slate-300 focus:border-blue-500 focus:bg-white"
      : "rounded border border-gray-200 placeholder:text-gray-300 focus:border-blue-400"
  }`;
  const descriptionInputClass = `w-full resize-none px-3 py-2.5 text-[13px] outline-none transition-colors ${
    isModal
      ? `rounded-xl border ${
          errors.description
            ? "border-red-400 bg-red-50"
            : "border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white"
        } placeholder:text-slate-300`
      : `rounded border ${
          errors.description ? "border-red-400" : "border-gray-200 focus:border-blue-400"
        }`
  }`;

  return (
    <div className="flex flex-col gap-4">
      {/* Meeting Type */}
      <div>
        <label className={labelClass}>Meeting Type</label>
        <div className={isModal ? "grid grid-cols-3 gap-2" : "flex flex-wrap gap-2"}>
          {MEETING_TYPES.map(({ value, label, emoji, icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => onChange("type", value)}
              className={meetingTypeButtonClass(value)}
            >
              {isModal ? (
                <>
                  <span className="text-xl leading-none">{emoji}</span>
                  {label}
                </>
              ) : (
                <>
                  {icon}
                  {label}
                </>
              )}
            </button>
          ))}
        </div>
        {errors.type && <p className="text-[11px] text-red-500 mt-1">{errors.type}</p>}
      </div>

      {/* Date */}
      <div>
        <label className={`block mb-1.5 font-semibold uppercase tracking-[0.6px] ${
          isModal ? "text-[11px] text-slate-400" : "text-xs text-gray-500"
        }`}>
          Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={form.date}
          onChange={(e) => onChange("date", e.target.value)}
          className={dateInputClass}
        />
        {errors.date && <p className="text-[11px] text-red-500 mt-1">{errors.date}</p>}
      </div>

      {/* Duration */}
      <div>
        <label className={`block mb-1.5 font-semibold uppercase tracking-[0.6px] ${
          isModal ? "text-[11px] text-slate-400" : "text-xs text-gray-500"
        }`}>
          Duration
        </label>
        <input
          type="text"
          value={form.duration}
          onChange={(e) => onChange("duration", e.target.value)}
          placeholder="e.g. 1 hour, 30 min, 1 day"
          className={durationInputClass}
        />
      </div>

      {/* Description */}
      <div>
        <label className={`block mb-1.5 font-semibold uppercase tracking-[0.6px] ${
          isModal ? "text-[11px] text-slate-400" : "text-xs text-gray-500"
        }`}>
          {isModal ? "Notes / Outcome" : "Description"}
        </label>
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder={
            isModal
              ? "What was discussed? Any follow-ups?"
              : "What happened in this meeting..."
          }
          className={descriptionInputClass}
        />
        {errors.description && (
          <p className="text-[11px] text-red-500 mt-1">{errors.description}</p>
        )}
      </div>
    </div>
  );
};

export default MeetingLogForm;

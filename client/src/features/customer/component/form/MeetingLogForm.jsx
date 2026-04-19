import React from 'react';
import { Phone, Users, Mail, MapPin, Video } from 'lucide-react';

const MEETING_TYPES = [
    { value: 'CALL', label: 'Call', emoji: '📞', icon: <Phone size={13} /> },
    { value: 'INPERSON', label: 'In-person', emoji: '🤝', icon: <Users size={13} /> },
    { value: 'ONLINEMEETING', label: 'Online Call', emoji: '🎥', icon: <Video size={13} /> },
    { value: 'EMAIL', label: 'Email', emoji: '📧', icon: <Mail size={13} /> },
    { value: 'SITEVISIT', label: 'Site Visit', emoji: '📍', icon: <MapPin size={13} /> },
];


const MeetingLogForm = ({
    form,
    errors = {},
    onChange,
    variant = 'modal',
}) => {
    const isModal = variant === 'modal';

    return (
        <div className="flex flex-col gap-4">

            {/* Meeting Type */}
            <div>
                <label className={`block mb-2 font-semibold uppercase tracking-[0.6px]
                    ${isModal ? 'text-[11px] text-slate-400' : 'text-xs text-gray-500'}`}>
                    Meeting Type
                </label>

                <div className={isModal ? 'grid grid-cols-3 gap-2' : 'flex flex-wrap gap-2'}>
                    {MEETING_TYPES.map(({ value, label, emoji, icon }) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => onChange('type', value)}
                            className={`transition-all duration-150 cursor-pointer font-medium
                                    ${isModal
                                    ? `flex flex-col items-center gap-1 py-3 px-2 rounded-xl border-[1.5px] text-[12px]
                                        ${form.type === value
                                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`
                                    : `flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm
                                        ${form.type === value
                                        ? 'bg-blue-500 text-white border-blue-500'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-500'}`
                                }`}
                        >
                            {isModal
                                ? <><span className="text-xl leading-none">{emoji}</span>{label}</>
                                : <>{icon}{label}</>
                            }
                        </button>
                    ))}
                </div>
                {errors.type && <p className="text-[11px] text-red-500 mt-1">{errors.type}</p>}
            </div>

            {/* Date + Duration */}
            <div className={`grid gap-3 grid-cols-1`}>
                <div>
                    <label className={`block mb-1.5 font-semibold uppercase tracking-[0.6px]
                        ${isModal ? 'text-[11px] text-slate-400' : 'text-xs text-gray-500'}`}>
                        Date <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        value={form.date}
                        onChange={e => onChange('date', e.target.value)}
                        className={`w-full px-3 py-2.5 text-[13px] outline-none transition-colors
                            ${isModal
                                ? `rounded-xl border ${errors.date ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white'}`
                                : `rounded border ${errors.date ? 'border-red-400' : 'border-gray-200 focus:border-blue-400'}`
                            }`}
                    />
                    {errors.date && <p className="text-[11px] text-red-500 mt-1">{errors.date}</p>}
                </div>

                
                <div>
                    <label className={`block mb-1.5 font-semibold uppercase tracking-[0.6px]
                        ${isModal ? 'text-[11px] text-slate-400' : 'text-xs text-gray-500'}`}>
                        Duration
                    </label>
                    <input
                        type="text"
                        value={form.duration}
                        onChange={e => onChange('duration', e.target.value)}
                        placeholder="e.g. 1 hour, 30 min, 1 day"
                        className={`w-full px-3 py-2.5 text-[13px] outline-none transition-colors
                            ${isModal
                                ? 'rounded-xl border border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white placeholder:text-slate-300'
                                : 'rounded border border-gray-200 focus:border-blue-400 placeholder:text-gray-300'
                            }`}
                    />
                </div>
                
            </div>

            {/* Description */}
            <div>
                <label className={`block mb-1.5 font-semibold uppercase tracking-[0.6px]
                    ${isModal ? 'text-[11px] text-slate-400' : 'text-xs text-gray-500'}`}>
                    {isModal ? 'Notes / Outcome' : 'Description'}
                </label>
                <textarea
                    rows={3}
                    value={form.description}
                    onChange={e => onChange('description', e.target.value)}
                    placeholder={isModal ? 'What was discussed? Any follow-ups?' : 'What happened in this meeting...'}
                    className={`w-full px-3 py-2.5 text-[13px] outline-none transition-colors resize-none
                        ${isModal
                            ? `rounded-xl border ${errors.description ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white'} placeholder:text-slate-300`
                            : `rounded border ${errors.description ? 'border-red-400' : 'border-gray-200 focus:border-blue-400'}`
                        }`}
                />
                {errors.description && <p className="text-[11px] text-red-500 mt-1">{errors.description}</p>}
            </div>
        </div>
    );
};

export { MEETING_TYPES };
export default MeetingLogForm;
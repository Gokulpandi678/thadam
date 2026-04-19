import React from 'react';
import MeetingLogForm from './MeetingLogForm';

const MeetingLog = ({ log, errors, handleChange }) => {
    return (
        <div className="flex flex-col gap-2 shadow-[0_0_6px_rgba(0,0,0,0.12)] rounded-lg p-3 ">
            <div>
                <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Meeting Log
                </h4>
                <p className="text-xs text-gray-400">Attach a log to this contact</p>
            </div>
            <MeetingLogForm
                form={log}
                errors={errors}
                onChange={handleChange}
                variant="inline"
            />
        </div>
    );
};

export default MeetingLog;
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import MeetingLogItem from './MeetingLogItem';
import NewMeetingLogForm from './NewMeetingLogForm';
import { TextButton } from '../../../../ui/atoms/button/Button';

const MeetingHistory = ({ customer, onLogMeeting }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const logs = customer?.logs ?? [];
  const firstName = customer?.firstName ?? 'Contact';

    const handleSubmit = (formData) => {
    onLogMeeting?.({
      type: formData.type,
      title: formData.title,
      description: formData.description,
      date: formData.date,
      duration: formData.duration,
    });
  };

  return (
    <div className="bg-white rounded-[20px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">

      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold tracking-[0.8px] uppercase text-slate-400">
            Meeting History
          </span>
          <span className="bg-blue-50 text-blue-600 text-[11px] font-bold px-2 py-0.5 rounded-full">
            {logs.length} total
          </span>
        </div>

        <TextButton 
          onClick={() => setIsModalOpen(true)}
          icon={<Plus />}
        > 
          Log Meeting with {firstName}
        </TextButton>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-[13px]">
          No interactions logged yet.
        </div>
      ) : (
        <div>
          {logs.map((log, i) => (
            <MeetingLogItem key={log.id} log={log} isLast={i === logs.length - 1} />
          ))}
        </div>
      )}

      {/* <button
        onClick={() => setIsModalOpen(true)}
        className="w-full mt-4 p-3 border-2 border-dashed border-[#93b4fd] rounded-xl bg-blue-50 text-blue-600 text-[13px] font-medium cursor-pointer flex items-center justify-center gap-1.5 transition-all duration-200 hover:bg-blue-100 hover:border-blue-600"
      >
        <Plus size={14} />
        Log a meeting with {firstName}
      </button> */}

      <NewMeetingLogForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default MeetingHistory;
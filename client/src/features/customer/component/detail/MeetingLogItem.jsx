import React from 'react';
import { Mail, Phone, Users, MapPin, Video } from 'lucide-react';
import { formatDate, formatDuration, getLogTitle } from '../../../../utils/customer.utils';

const LOG_ICON_MAP = {
  EMAIL: { 
    icon: <Mail size={13} />, 
    bg: 'bg-blue-50',   
    color: 'text-blue-600' 
  },
  CALL: { 
    icon: <Phone size={13} />,       
    bg: 'bg-violet-50', 
    color: 'text-violet-600' 
  },
  INPERSON: { 
    icon: <Users size={13} />,       
    bg: 'bg-teal-50',   
    color: 'text-teal-600' 
  },
  SITEVISIT: { 
    icon: <MapPin size={13} />,    
    bg: 'bg-amber-50',  
    color: 'text-amber-600' 
  },
  ONLINEMEETING: { 
    icon: <Video size={13} />, 
    bg: 'bg-pink-50',   
    color: 'text-pink-600' 
  },
};

const MeetingLogItem = ({ log, isLast }) => {
  console.log(log)
  const config = LOG_ICON_MAP[log?.type] ?? LOG_ICON_MAP.NOTE;

  return (
    <div className={`flex gap-3.5 ${isLast ? '' : 'pb-5'}`}>

      {/* Timeline spine */}
      <div className="flex flex-col items-center w-3.5 shrink-0 pt-1">
        <div className="w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-blue-50 shrink-0" />
        {!isLast && <div className="flex-1 w-0.5 bg-[#e4e8f0] mt-1" />}
      </div>

      {/* Content */}
      <div className="flex-1">
        <p className="text-[11px] text-slate-400 font-medium mb-2">
          {formatDate(log.createdAt)}{log.duration ? ` · ${formatDuration(log.duration)}` : ''}
        </p>

        <div className="bg-[#f8faff] border border-[#e4e8f0] rounded-xl px-4 py-3.5 transition-all duration-200 cursor-default hover:border-[#93b4fd] hover:shadow-[0_2px_12px_rgba(37,99,235,0.08)] hover:translate-x-0.5">
          <div className="flex items-center gap-2 mb-1.5">
            <div className={`w-6.5 h-6.5 rounded-lg ${config.bg} ${config.color} flex items-center justify-center shrink-0`}>
              {config.icon}
            </div>
            <span className="text-[13px] font-semibold text-slate-900">
              {getLogTitle(log)}
            </span>
          </div>
          <p className="text-[12.5px] text-slate-500 leading-relaxed">{log.description}</p>
        </div>
      </div>
    </div>
  );
};

export default MeetingLogItem;
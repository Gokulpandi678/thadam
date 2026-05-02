// import { useEffect, useRef, useState } from "react";
// import {
//   Mail,
//   Phone,
//   Users,
//   MapPin,
//   Video,
//   Pencil,
//   Trash2,
//   ChevronDown,
//   ChevronUp,
// } from "lucide-react";
// import { formatDate, formatDuration, getLogTitle } from "../../../../utils/customer.utils";

// const LOG_ICON_MAP = {
//   EMAIL: { icon: <Mail size={13} />, bg: "bg-blue-50", color: "text-blue-600" },
//   CALL: { icon: <Phone size={13} />, bg: "bg-violet-50", color: "text-violet-600" },
//   INPERSON: { icon: <Users size={13} />, bg: "bg-teal-50", color: "text-teal-600" },
//   SITEVISIT: { icon: <MapPin size={13} />, bg: "bg-amber-50", color: "text-amber-600" },
//   ONLINEMEETING: { icon: <Video size={13} />, bg: "bg-pink-50", color: "text-pink-600" },
// };

// const COLLAPSED_DESCRIPTION_STYLE = {
//   display: "-webkit-box",
//   WebkitLineClamp: 3,
//   WebkitBoxOrient: "vertical",
//   overflow: "hidden",
// };

// const MeetingLogItem = ({ log, isLast, onEdit, onDelete }) => {
//   // Fallback for unknown log types returned by the API.
//   const config = LOG_ICON_MAP[log?.type] ?? LOG_ICON_MAP.EMAIL;
//   const descriptionRef = useRef(null);
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [isExpandable, setIsExpandable] = useState(false);

//   useEffect(() => {
//     const node = descriptionRef.current;
//     if (!node) return;
//     setIsExpandable(node.scrollHeight > node.clientHeight + 1);
//   }, [log?.description, isExpanded]);

//   return (
//     <div className={`flex gap-3.5 ${isLast ? "" : "pb-5"}`}>
//       {/* Timeline spine */}
//       <div className="flex flex-col items-center w-3.5 shrink-0 pt-1">
//         <div className="w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-blue-50 shrink-0" />
//         {!isLast && <div className="flex-1 w-0.5 bg-[#e4e8f0] mt-1" />}
//       </div>

//       {/* Content */}
//       <div className="flex-1">
//         <p className="text-[11px] text-slate-400 font-medium mb-2">
//           {formatDate(log.date ?? log.createdAt)}
//           {log.duration ? ` · ${formatDuration(log.duration)}` : ""}
//         </p>

//         <div className="bg-[#f8faff] border border-[#e4e8f0] rounded-xl px-4 py-3.5 transition-all duration-200 cursor-default hover:border-[#93b4fd] hover:shadow-[0_2px_12px_rgba(37,99,235,0.08)] hover:translate-x-0.5">
//           <div className="flex items-start justify-between gap-3 mb-1.5">
//             <div className="flex items-center gap-2 min-w-0">
//               <div
//                 className={`w-6.5 h-6.5 rounded-lg ${config.bg} ${config.color} flex items-center justify-center shrink-0`}
//               >
//                 {config.icon}
//               </div>
//               <span className="text-[13px] font-semibold text-slate-900">
//                 {getLogTitle(log)}
//               </span>
//             </div>
//             <div className="flex items-center gap-1 shrink-0">
//               <button
//                 type="button"
//                 onClick={() => onEdit?.(log)}
//                 className="cursor-pointer rounded-md bg-blue-500 p-1.5 text-white transition-colors duration-100 hover:bg-blue-100 hover:text-blue-600"
//                 title="Edit log"
//               >
//                 <Pencil size={14} />
//               </button>
//               <button
//                 type="button"
//                 onClick={() => onDelete?.(log)}
//                 className="cursor-pointer rounded-md bg-red-500 p-1.5 text-white transition-colors duration-100 hover:bg-red-100 hover:text-red-500"
//                 title="Delete log"
//               >
//                 <Trash2 size={14} />
//               </button>
//             </div>
//           </div>
//           {log.description && (
//             <div>
//               <p
//                 ref={descriptionRef}
//                 className="text-[12.5px] text-slate-500 leading-relaxed whitespace-pre-wrap"
//                 style={isExpanded ? undefined : COLLAPSED_DESCRIPTION_STYLE}
//               >
//                 {log.description}
//               </p>
//               {isExpandable && (
//                 <button
//                   type="button"
//                   onClick={() => setIsExpanded((prev) => !prev)}
//                   className="mt-2 inline-flex items-center gap-1 text-[12px] font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
//                 >
//                   {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
//                   {isExpanded ? "Show less" : "Show more"}
//                 </button>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MeetingLogItem;


import { useEffect, useRef, useState } from "react";
import {
  Mail,
  Phone,
  Users,
  MapPin,
  Video,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { formatDate, formatDuration, getLogTitle } from "../../../../utils/customer.utils";

const LOG_ICON_MAP = {
  EMAIL: { icon: <Mail size={13} />, bg: "bg-blue-50", color: "text-blue-600" },
  CALL: { icon: <Phone size={13} />, bg: "bg-violet-50", color: "text-violet-600" },
  INPERSON: { icon: <Users size={13} />, bg: "bg-teal-50", color: "text-teal-600" },
  SITEVISIT: { icon: <MapPin size={13} />, bg: "bg-amber-50", color: "text-amber-600" },
  ONLINEMEETING: { icon: <Video size={13} />, bg: "bg-pink-50", color: "text-pink-600" },
};

const COLLAPSED_DESCRIPTION_STYLE = {
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

const MeetingLogItem = ({ log, isLast, onEdit, onDelete }) => {
  // Fallback for unknown log types returned by the API.
  const config = LOG_ICON_MAP[log?.type] ?? LOG_ICON_MAP.EMAIL;
  const descriptionRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpandable, setIsExpandable] = useState(false);

  useEffect(() => {
    const node = descriptionRef.current;
    if (!node) return;
    setIsExpandable(node.scrollHeight > node.clientHeight + 1);
  }, [log?.description, isExpanded]);

  return (
    <div className={`flex gap-3.5 ${isLast ? "" : "pb-5"}`}>
      {/* Timeline spine */}
      <div className="flex flex-col items-center w-3.5 shrink-0 pt-1">
        <div className="w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-blue-50 shrink-0" />
        {!isLast && <div className="flex-1 w-0.5 bg-[#e4e8f0] mt-1" />}
      </div>

      {/* Content */}
      <div className="flex-1">
        <p className="text-[11px] text-slate-400 font-medium mb-2">
          {formatDate(log.date ?? log.createdAt)}
          {log.duration ? ` · ${formatDuration(log.duration)}` : ""}
        </p>

        <div className="bg-[#f8faff] border border-[#e4e8f0] rounded-xl px-4 py-3.5 transition-all duration-200 cursor-default hover:border-[#93b4fd] hover:shadow-[0_2px_12px_rgba(37,99,235,0.08)] hover:translate-x-0.5">
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className={`w-6.5 h-6.5 rounded-lg ${config.bg} ${config.color} flex items-center justify-center shrink-0`}
              >
                {config.icon}
              </div>
              <span className="text-[13px] font-semibold text-slate-900">
                {getLogTitle(log)}
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => onEdit?.(log)}
                className="cursor-pointer rounded-md bg-blue-500 p-2 sm:p-1.5 text-white transition-colors duration-100 hover:bg-blue-100 hover:text-blue-600"
                title="Edit log"
              >
                <Pencil size={14} />
              </button>
              <button
                type="button"
                onClick={() => onDelete?.(log)}
                className="cursor-pointer rounded-md bg-red-500 p-2 sm:p-1.5 text-white transition-colors duration-100 hover:bg-red-100 hover:text-red-500"
                title="Delete log"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          {log.description && (
            <div>
              <p
                ref={descriptionRef}
                className="text-[12.5px] text-slate-500 leading-relaxed whitespace-pre-wrap"
                style={isExpanded ? undefined : COLLAPSED_DESCRIPTION_STYLE}
              >
                {log.description}
              </p>
              {isExpandable && (
                <button
                  type="button"
                  onClick={() => setIsExpanded((prev) => !prev)}
                  className="mt-2 inline-flex items-center gap-1 text-[12px] font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  {isExpanded ? "Show less" : "Show more"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeetingLogItem;
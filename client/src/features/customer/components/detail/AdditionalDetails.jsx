// import { useState } from "react";
// import { formatDate, isClientContact } from "../../../../utils/customer.utils";
// import DetailTabStrip from "./DetailTabStrip";
// import ClientProfileCard from "./ClientProfileCard";
// import MeetingHistory from "./MeetingHistory";

// const Field = ({ label, value }) => {
//   const lower = label.toLowerCase();
//   const isEmail = lower.includes("email");
//   const isPhone = lower.includes("phone");
//   const isAddress = lower.includes("address");

//   const mapsRedirectUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(value)}`;
//   const mapsEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(value)}&output=embed&z=15`;

//   const href = isEmail
//     ? `mailto:${value}`
//     : isPhone
//       ? `tel:${value}`
//       : null;

//   return (
//     <div>
//       <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium mb-1">
//         {label}
//       </p>

//       {isAddress ? (
//         <div>
//           <a
//             href={mapsRedirectUrl}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-[13px] font-semibold text-blue-500 hover:underline"
//           >
//             {value ?? "—"}
//           </a>

//           <iframe
//             src={mapsEmbedUrl}
//             width="100%"
//             height="220"
//             style={{ border: "none", borderRadius: 8, marginTop: 8 }}
//             allowFullScreen
//             loading="lazy"
//             title="Address map"
//           />
//         </div>
//       ) : href ? (
//         <a href={href} className="text-[13px] font-semibold text-blue-500 hover:underline">
//           {value ?? "—"}
//         </a>
//       ) : (
//         <p className="text-[13px] font-semibold text-slate-700">{value ?? "—"}</p>
//       )}
//     </div>
//   );
// };

// const SectionLabel = ({ children }) => (
//   <p className="text-sm uppercase tracking-widest text-slate-400 font-semibold mt-5 mb-3 first:mt-0">
//     {children}
//   </p>
// );


// const AdditionalDetails = ({ customer, onLogMeeting, tab }) => {
//   const isClient = isClientContact(customer);

//   const tabs = [
//     { key: "contact", label: "Contact" },
//     ...(isClient ? [{ key: "client", label: "Client" }] : []),
//     { key: "meetings", label: "Meetings", count: customer?.logs?.length ?? 0 },
//   ];

//   // const activeTab = tabs[tab];
//   const [activeTab, setActiveTab] = useState(tab);

//   if (!customer) return null;

//   const fullAddress = [
//     customer.addressNumber && customer.addressStreet
//       ? `${customer.addressNumber}, ${customer.addressStreet}`
//       : customer.addressStreet || customer.addressNumber,
//     customer.addressCity,
//     customer.addressState,
//     customer.addressPostcode,
//     customer.addressCountry,
//   ]
//     .filter(Boolean)
//     .join(", ");

//   return (
//     <div className="bg-white rounded-[20px] px-6 pt-5 pb-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">

//       {activeTab === "info" && (
//         <div>
//           <SectionLabel>Work</SectionLabel>
//           <div className="grid grid-cols-3 gap-5">
//             <Field label="Company" value={customer.company} />
//             <Field label="Designation" value={customer.designation} />
//             <Field label="Role" value={customer.role} />
//           </div>

//           <SectionLabel>Contact</SectionLabel>
//           <div className="grid grid-cols-3 gap-5">
//             <Field label="Secondary Email" value={customer.secondaryEmail} />
//             <Field label="Secondary Phone" value={customer.secondaryContactNo} />
//             <Field label="Last Contacted" value={formatDate(customer.lastContactedDate)} />
//           </div>

//           {fullAddress && (
//             <>
//               <SectionLabel>Address</SectionLabel>
//               <div className="grid grid-cols-3 gap-5">
//                 <Field label="Full Address" value={fullAddress} />
//               </div>
//             </>
//           )}

//           {customer.referredBy && (
//             <>
//               <SectionLabel>Other</SectionLabel>
//               <div className="grid grid-cols-3 gap-5">
//                 <Field label="Referred By" value={customer.referredBy} />
//               </div>
//             </>
//           )}
//         </div>
//       )}

//       {activeTab === "client" && isClient && <ClientProfileCard customer={customer} />}

//       {activeTab === "meetings" && (
//         <MeetingHistory customer={customer} onLogMeeting={onLogMeeting} embedded />
//       )}
//     </div>
//   );
// };

// export default AdditionalDetails;

import { useState } from "react";
import { formatDate, isClientContact } from "../../../../utils/customer.utils";
import DetailTabStrip from "./DetailTabStrip";
import ClientProfileCard from "./ClientProfileCard";
import MeetingHistory from "./MeetingHistory";

const Field = ({ label, value }) => {
  const lower = label.toLowerCase();
  const isEmail = lower.includes("email");
  const isPhone = lower.includes("phone");
  const isAddress = lower.includes("address");

  const mapsRedirectUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(value)}`;
  const mapsEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(value)}&output=embed&z=15`;

  const href = isEmail
    ? `mailto:${value}`
    : isPhone
      ? `tel:${value}`
      : null;

  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium mb-1">
        {label}
      </p>

      {isAddress ? (
        <div>
          <a
            href={mapsRedirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] font-semibold text-blue-500 hover:underline"
          >
            {value ?? "—"}
          </a>

          <iframe
            src={mapsEmbedUrl}
            width="100%"
            height="220"
            style={{ border: "none", borderRadius: 8, marginTop: 8 }}
            allowFullScreen
            loading="lazy"
            title="Address map"
          />
        </div>
      ) : href ? (
        <a href={href} className="text-[13px] font-semibold text-blue-500 hover:underline">
          {value ?? "—"}
        </a>
      ) : (
        <p className="text-[13px] font-semibold text-slate-700">{value ?? "—"}</p>
      )}
    </div>
  );
};

const SectionLabel = ({ children }) => (
  <p className="text-sm uppercase tracking-widest text-slate-400 font-semibold mt-5 mb-3 first:mt-0">
    {children}
  </p>
);


const AdditionalDetails = ({ customer, onLogMeeting, tab }) => {
  const isClient = isClientContact(customer);

  if (!customer) return null;

  const fullAddress = [
    customer.addressNumber && customer.addressStreet
      ? `${customer.addressNumber}, ${customer.addressStreet}`
      : customer.addressStreet || customer.addressNumber,
    customer.addressCity,
    customer.addressState,
    customer.addressPostcode,
    customer.addressCountry,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="bg-white rounded-[20px] px-4 sm:px-6 pt-5 pb-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">

      {(tab === "contact" || tab === "info") && (
        <div>
          <SectionLabel>Work</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            <Field label="Company" value={customer.company} />
            <Field label="Designation" value={customer.designation} />
            <Field label="Role" value={customer.role} />
          </div>

          <SectionLabel>Contact</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            <Field label="Secondary Email" value={customer.secondaryEmail} />
            <Field label="Secondary Phone" value={customer.secondaryContactNo} />
            <Field label="Last Contacted" value={formatDate(customer.lastContactedDate)} />
          </div>

          {fullAddress && (
            <>
              <SectionLabel>Address</SectionLabel>
              <div className="grid grid-cols-1 gap-4 sm:gap-5">
                <Field label="Full Address" value={fullAddress} />
              </div>
            </>
          )}

          {customer.referredBy && (
            <>
              <SectionLabel>Other</SectionLabel>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                <Field label="Referred By" value={customer.referredBy} />
              </div>
            </>
          )}
        </div>
      )}

      {tab === "client" && isClient && <ClientProfileCard customer={customer} />}

      {tab === "meetings" && (
        <MeetingHistory customer={customer} onLogMeeting={onLogMeeting} embedded />
      )}
    </div>
  );
};

export default AdditionalDetails;
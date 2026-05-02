// import { useState } from "react";
// import useCustomer from "../../../hooks/useCustomer";
// import { ProfileCard, AdditionalDetails, MeetingHistory, DetailTabStrip } from "../components/detail";
// import EditCustomerSidebar from "./EditCustomerSidebar";
// import { ConfirmationModal } from "../../../shared/components";
// import { useDeleteCustomer } from "../../../service/useCustomerApi";
// import { getFullName, isClientContact } from "../../../utils/customer.utils";
// import ConvertAsClientModal from "../../client/components/ConvertAsClientModal";

// const ContactDetails = ({ customer: initialCustomer, onDeleteSuccess }) => {
//   const {
//     customer,
//     profileCompletion,
//     handleEdit,
//     handleLogMeeting,
//     handleEditLog,
//     handleDeleteLog,
//     isEditing,
//     cancelEdit,
//     isLoggingMeeting,
//     isEditingLog,
//     isDeletingLog,
//   } = useCustomer(initialCustomer);

//   const [activeTab, setActiveTab] = useState("info");
//   const [customerToDelete, setCustomerToDelete] = useState(null);
//   const [showConvertModal, setShowConvertModal] = useState(false);

//   const { mutate: deleteCustomer, isPending: isDeleting } = useDeleteCustomer();

//   const handleDeleteConfirm = () => {
//     deleteCustomer(customerToDelete?.id, {
//       onSuccess: () => {
//         setCustomerToDelete(null);
//         onDeleteSuccess?.();
//       },
//     });
//   };

//   if (!customer) return null;

//   const isClient = isClientContact(customer);

//   const tabs = [
//     { key: "info", label: "Basic Info" },
//     ...(isClient ? [{ key: "client", label: "Client Info" }] : []),
//     { key: "meetings", label: "Meeting Logs", count: customer.logs?.length ?? 0 },
//   ];

//   return (
//     <>
//       <div
//         className="grid gap-5 p-6 h-[87vh] overflow-hidden"
//         style={{ gridTemplateColumns: "300px 1fr" }}
//       >
//         <div className="overflow-hidden">
//           <ProfileCard
//             customer={customer}
//             profileCompletion={profileCompletion}
//             onEdit={handleEdit}
//             onConvertAsClient={() => setShowConvertModal(true)}
//             onDelete={() => setCustomerToDelete(customer)}
//           />
//         </div>

//         <div className="flex flex-col overflow-hidden">
//           <DetailTabStrip tabs={tabs} active={activeTab} onChange={setActiveTab} />

//           <div className="flex-1 overflow-y-auto pr-1">
//             {activeTab === "info" && <AdditionalDetails customer={customer} tab={activeTab}/>}

//             {activeTab === "client" && isClient && (
//               <AdditionalDetails customer={customer} onLogMeeting={handleLogMeeting} tab={activeTab}/>
//             )}

//             {activeTab === "meetings" && (
//               <MeetingHistory
//                 customer={customer}
//                 onLogMeeting={handleLogMeeting}
//                 onEditLog={handleEditLog}
//                 onDeleteLog={handleDeleteLog}
//                 isLoggingMeeting={isLoggingMeeting}
//                 isEditingLog={isEditingLog}
//                 isDeletingLog={isDeletingLog}
//               />
//             )}
//           </div>
//         </div>

//         {isEditing && (
//           <EditCustomerSidebar customer={customer} onClose={cancelEdit} isOpen={isEditing} />
//         )}
//       </div>

//       <ConvertAsClientModal
//         isOpen={showConvertModal}
//         onClose={() => setShowConvertModal(false)}
//         customer={customer}
//       />

//       <ConfirmationModal
//         isOpen={!!customerToDelete}
//         title="Delete contact"
//         message={`"${getFullName(customerToDelete)}" will be moved to the temporary delete bin and permanently deleted after 30 days.`}
//         confirmLabel="Delete"
//         onConfirm={handleDeleteConfirm}
//         onCancel={() => setCustomerToDelete(null)}
//         isLoading={isDeleting}
//         variant="danger"
//       />
//     </>
//   );
// };

// export default ContactDetails;


import { useState } from "react";
import useCustomer from "../../../hooks/useCustomer";
import { ProfileCard, AdditionalDetails, MeetingHistory, DetailTabStrip } from "../components/detail";
import EditCustomerSidebar from "./EditCustomerSidebar";
import { ConfirmationModal } from "../../../shared/components";
import { useDeleteCustomer } from "../../../service/useCustomerApi";
import { getFullName, isClientContact } from "../../../utils/customer.utils";
import ConvertAsClientModal from "../../client/components/ConvertAsClientModal";

const ContactDetails = ({ customer: initialCustomer, onDeleteSuccess }) => {
  const {
    customer,
    profileCompletion,
    handleEdit,
    handleLogMeeting,
    handleEditLog,
    handleDeleteLog,
    isEditing,
    cancelEdit,
    isLoggingMeeting,
    isEditingLog,
    isDeletingLog,
  } = useCustomer(initialCustomer);

  const [activeTab, setActiveTab] = useState("info");
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [showConvertModal, setShowConvertModal] = useState(false);

  const { mutate: deleteCustomer, isPending: isDeleting } = useDeleteCustomer();

  const handleDeleteConfirm = () => {
    deleteCustomer(customerToDelete?.id, {
      onSuccess: () => {
        setCustomerToDelete(null);
        onDeleteSuccess?.();
      },
    });
  };

  if (!customer) return null;

  const isClient = isClientContact(customer);

  const tabs = [
    { key: "info", label: "Basic Info" },
    ...(isClient ? [{ key: "client", label: "Client Info" }] : []),
    { key: "meetings", label: "Meeting Logs", count: customer.logs?.length ?? 0 },
  ];

  return (
    <>
      {/* ── Mobile: single scrollable column
          ── Desktop (lg+): fixed-height two-column grid ── */}
      <div className="flex flex-col lg:grid lg:gap-5 lg:p-6 lg:h-[87vh] lg:overflow-hidden lg:[grid-template-columns:300px_1fr] p-4 gap-4">

        {/* Profile card — full width on mobile, fixed sidebar on desktop */}
        <div className="lg:overflow-hidden">
          <ProfileCard
            customer={customer}
            profileCompletion={profileCompletion}
            onEdit={handleEdit}
            onConvertAsClient={() => setShowConvertModal(true)}
            onDelete={() => setCustomerToDelete(customer)}
          />
        </div>

        {/* Tab panel — scrolls independently on desktop, flows naturally on mobile */}
        <div className="flex flex-col lg:overflow-hidden">
          <DetailTabStrip tabs={tabs} active={activeTab} onChange={setActiveTab} />

          <div className="flex-1 lg:overflow-y-auto lg:pr-1">
            {activeTab === "info" && (
              <AdditionalDetails customer={customer} tab="contact" />
            )}

            {activeTab === "client" && isClient && (
              <AdditionalDetails customer={customer} onLogMeeting={handleLogMeeting} tab="client" />
            )}

            {activeTab === "meetings" && (
              <MeetingHistory
                customer={customer}
                onLogMeeting={handleLogMeeting}
                onEditLog={handleEditLog}
                onDeleteLog={handleDeleteLog}
                isLoggingMeeting={isLoggingMeeting}
                isEditingLog={isEditingLog}
                isDeletingLog={isDeletingLog}
              />
            )}
          </div>
        </div>
      </div>

      {isEditing && (
        <EditCustomerSidebar customer={customer} onClose={cancelEdit} isOpen={isEditing} />
      )}

      <ConvertAsClientModal
        isOpen={showConvertModal}
        onClose={() => setShowConvertModal(false)}
        customer={customer}
      />

      <ConfirmationModal
        isOpen={!!customerToDelete}
        title="Delete contact"
        message={`"${getFullName(customerToDelete)}" will be moved to the temporary delete bin and permanently deleted after 30 days.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setCustomerToDelete(null)}
        isLoading={isDeleting}
        variant="danger"
      />
    </>
  );
};

export default ContactDetails;
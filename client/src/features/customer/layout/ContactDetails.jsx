import { useState } from "react";
import useCustomer from "../../../hooks/useCustomer";
import ProfileCard from "../component/detail/ProfileCard";
import EditCustomerSidebar from "./EditCustomerSidebar";
import AdditionalDetails from "../component/detail/AdditionalContactDetails";
import MeetingHistory from "../component/detail/MeetingHistory";
import ConfirmationModal from "../../actions/ConfirmationModal";
import { useDeleteCustomer } from "../../../service/useCustomerApi";
import { getFullName } from "../../../utils/customer.utils";
import ConvertAsClientModal from "../../client/ConvertAsClientModal";
import DetailTabStrip from "../component/detail/DetailTabStrip";

const ContactDetails = ({ customer: initialCustomer, onDeleteSuccess }) => {
    const {
        customer, profileCompletion,
        handleEdit, handleLogMeeting,
        isEditing, cancelEdit,
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

    const isClient = customer.role === "Client";

    const tabs = [
        { key: "info", label: "Basic Info" },
        ...(isClient ? [{ key: "client", label: "Client Info" }] : []),
        { key: "meetings", label: "Meeting Logs", count: customer.logs?.length ?? 0 },
    ];

    return (
        <>
            <div
                className="grid gap-5 p-6 h-[87vh] overflow-hidden"
                style={{ gridTemplateColumns: "300px 1fr" }}
            >
                {/* Left — ProfileCard unchanged */}
                <div className="overflow-hidden">
                    <ProfileCard
                        customer={customer}
                        profileCompletion={profileCompletion}
                        onEdit={handleEdit}
                        onConvertAsClient={() => setShowConvertModal(true)}
                        onDelete={() => setCustomerToDelete(customer)}
                    />
                </div>

                {/* Right — tab strip + existing components */}
                <div className="flex flex-col overflow-hidden">
                    <DetailTabStrip tabs={tabs} active={activeTab} onChange={setActiveTab} />

                    <div className="flex-1 overflow-y-auto pr-1">

                        {/* Basic Info tab — AdditionalDetails without client section */}
                        {activeTab === "info" && (
                            <AdditionalDetails customer={customer} />
                        )}

                        {/* Client Info tab — AdditionalDetails showing only client fields */}
                        {activeTab === "client" && isClient && (
                            <AdditionalDetails customer={customer} clientOnly />
                        )}

                        {/* Meeting Logs tab — MeetingHistory completely unchanged */}
                        {activeTab === "meetings" && (
                            <MeetingHistory
                                customer={customer}
                                onLogMeeting={handleLogMeeting}
                            />
                        )}
                    </div>
                </div>

                {isEditing && (
                    <EditCustomerSidebar
                        customer={customer}
                        onClose={cancelEdit}
                        isOpen={isEditing}
                    />
                )}
            </div>

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
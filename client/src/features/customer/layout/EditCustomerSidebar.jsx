import { useContext, useState } from "react";
import { useFullContactForm } from "../../../hooks/useFullContactForm";
import FullContactForm from "../component/form/FullContactForm";
import { X } from "lucide-react";
import { CustomerContext } from "../../../context/CustomerContext";
import { useMeetingLogs } from "../../../hooks/useMeetingLogs";
import { useEditProfilePic } from "../../../service/useCustomerApi";

const EditCustomerSidebar = ({ isOpen, onClose, customer }) => {
    const { updateCustomer } = useContext(CustomerContext);
    const { form, errors, handleChange, validate } = useFullContactForm(customer);
    const { log, errors: logErrors, handleChange: logChange, MEET_TYPES } = useMeetingLogs();

    // Track a newly selected profile picture file
    const [profileFile, setProfileFile] = useState(null);
    const { mutateAsync: editProfilePic } = useEditProfilePic();

    const handleSubmit = async () => {
        if (!validate()) return;

        // Update contact fields
        await updateCustomer(customer.id, form);

        // If user picked a new photo, upload it
        if (profileFile) {
            await editProfilePic({ id: customer.id, file: profileFile });
        }

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex justify-end z-50">
            <div className="absolute inset-0 bg-black/30" onClick={onClose} />
            <div className="relative w-112.5 bg-white h-full shadow-xl p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Edit Customer</h2>
                    <button onClick={onClose} className="cursor-pointer">
                        <X size={20} />
                    </button>
                </div>
                <FullContactForm
                    form={form}
                    errors={errors}
                    handleChange={handleChange}
                    onSubmit={handleSubmit}
                    submitLabel="Update Contact"
                    log={log}
                    logErrors={logErrors}
                    logChange={logChange}
                    MEET_TYPES={MEET_TYPES}
                    profileFile={profileFile}
                    setProfileFile={setProfileFile}
                    existingProfileUrl={customer?.profilePicture}
                />
            </div>
        </div>
    );
};

export default EditCustomerSidebar;
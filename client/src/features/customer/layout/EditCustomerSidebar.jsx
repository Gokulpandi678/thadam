import { useContext, useState } from "react";
import { CustomerContext } from "../../../context/CustomerContext";
import { useEditProfilePic } from "../../../service/useCustomerApi";
import { useContactDrawerForm } from "../../../hooks/useContactDrawerForm";
import ContactDrawer from "../component/form/ContactDrawer";


const EditCustomerSidebar = ({ isOpen, onClose, customer }) => {
    const { updateCustomer } = useContext(CustomerContext);
    const [profileFile, setProfileFile] = useState(null);
    const { mutateAsync: editProfilePic } = useEditProfilePic();

    const { form, errors, onChange, validate, serialise } =
        useContactDrawerForm(customer, isOpen);

    const handleSubmit = async () => {
        if (!validate()) return;
        await updateCustomer(customer.id, serialise());
        if (profileFile) {
            await editProfilePic({ id: customer.id, file: profileFile });
        }
        onClose();
    };

    return (
        <ContactDrawer
            isOpen={isOpen}
            onClose={onClose}
            mode="edit"
            contact={customer}
            form={form}
            errors={errors}
            onChange={onChange}
            onSubmit={handleSubmit}
        />
    );
};

export default EditCustomerSidebar;
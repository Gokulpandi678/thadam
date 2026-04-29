import { useContext } from "react";
import { CustomerContext } from "../../../context/CustomerContext";
import { useEditProfilePic } from "../../../service/useCustomerApi";
import { useContactDrawerForm } from "../../../hooks/useContactDrawerForm";
import ContactDrawer from "../components/form/ContactDrawer";

const EditCustomerSidebar = ({ isOpen, onClose, customer }) => {
  const { updateCustomer } = useContext(CustomerContext);
  const { mutateAsync: editProfilePic } = useEditProfilePic();

  const { form, errors, onChange, validate, serialiseCustomerUpdate } = useContactDrawerForm(
    customer,
    isOpen
  );

  const handleSubmit = async () => {
    if (!validate()) return;
    await updateCustomer(customer.id, serialiseCustomerUpdate());
    if (form._profileFile) {
      await editProfilePic({ id: customer.id, file: form._profileFile });
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

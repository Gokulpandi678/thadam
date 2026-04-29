import { useContactDrawerForm } from "../../../hooks/useContactDrawerForm";
import { useConvertAsClient } from "../../../service/useClientApi";
import ContactDrawer from "../../customer/components/form/ContactDrawer";
import contactDrawerTabs from "../../customer/components/form/contactDrawerConfig";

const clientOnlyTabs = [contactDrawerTabs.find((t) => t.label === "Client")];

const ConvertAsClientModal = ({ isOpen, onClose, customer }) => {
  const { mutate: convert, isPending } = useConvertAsClient();

  const { form, errors, onChange, validate, serialise } = useContactDrawerForm(null, isOpen);

  const handleSubmit = () => {
    if (!validate()) return;
    convert(
      { customerId: customer.id, params: serialise() },
      { onSuccess: onClose }
    );
  };

  return (
    <ContactDrawer
      isOpen={isOpen}
      onClose={onClose}
      mode="add"
      contact={customer}
      form={form}
      errors={errors}
      onChange={onChange}
      onSubmit={handleSubmit}
      isPending={isPending}
      tabs={clientOnlyTabs}
      submitLabel="Convert as client"
    />
  );
};

export default ConvertAsClientModal;

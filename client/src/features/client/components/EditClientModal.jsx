import { useContactDrawerForm } from "../../../hooks/useContactDrawerForm";
import { useUpdateClient } from "../../../service/useClientApi";
import ContactDrawer from "../../customer/components/form/ContactDrawer";
import contactDrawerTabs from "../../customer/components/form/contactDrawerConfig";

const clientOnlyTabs = [contactDrawerTabs.find((t) => t.label === "Client")];

const EditClientModal = ({ isOpen, onClose, client }) => {
  const { mutate: update, isPending } = useUpdateClient();

  const { form, errors, onChange, validate, serialise } = useContactDrawerForm(client, isOpen);

  const handleSubmit = () => {
    if (!validate()) return;
    update(
      { customerId: client.customerId, params: serialise() },
      { onSuccess: onClose }
    );
  };

  return (
    <ContactDrawer
      isOpen={isOpen}
      onClose={onClose}
      mode="edit"
      contact={client}
      form={form}
      errors={errors}
      onChange={onChange}
      onSubmit={handleSubmit}
      isPending={isPending}
      tabs={clientOnlyTabs}
      submitLabel="Save changes"
    />
  );
};

export default EditClientModal;

import { useContext, useState } from "react";
import { CustomerContext } from "../../../../context/CustomerContext";
import { useAddProfilePic } from "../../../../service/useCustomerApi";
import { useContactDrawerForm } from "../../../../hooks/useContactDrawerForm";
import ContactDrawer from "./ContactDrawer";
import contactDrawerTabs from "./contactDrawerConfig";
import logger from "../../../../utils/logger";

const AddContactDrawer = ({ isOpen, onClose }) => {
  const { createNewCustomer } = useContext(CustomerContext);
  const { mutateAsync: addProfilePic } = useAddProfilePic();

  const [isPending, setIsPending] = useState(false);

  const { form, errors, onChange, validate, serialise, getMeetingLogPayload } =
    useContactDrawerForm(null, isOpen);

  const handleSubmit = async () => {
    if (!validate()) return;

    const logsPayload = getMeetingLogPayload();

    setIsPending(true);
    try {
      const payload = {
        ...serialise(),
        ...(logsPayload ? { logs: logsPayload } : {}),
      };

      const customer = await createNewCustomer(payload);

      if (form._profileFile) {
        await addProfilePic({
          id: customer?.data?.result?.id,
          file: form._profileFile,
        });
      }

      onClose();
    } catch (err) {
      logger.error(err, "AddContactDrawer");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <ContactDrawer
      isOpen={isOpen}
      onClose={onClose}
      mode="add"
      form={form}
      errors={errors}
      onChange={onChange}
      onSubmit={handleSubmit}
      isPending={isPending}
      tabs={contactDrawerTabs}
      submitLabel="Save contact"
    />
  );
};

export default AddContactDrawer;

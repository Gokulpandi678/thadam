import { useContext, useState } from "react";
import { RotateCcw } from "lucide-react";
import Header from "../ui/molecules/header/Header";
import { ConfirmationModal } from "../shared/components";
import { ClientContext } from "../context/ClientContext";
import { ClientTable } from "../features/client/containers";
import { EditClientModal } from "../features/client/components";

const ClientsPage = () => {
  const { revertClient, isReverting } = useContext(ClientContext);

  const [clientToEdit, setClientToEdit] = useState(null);
  const [clientToRevert, setClientToRevert] = useState(null);

  const handleRevertConfirm = () => {
    revertClient(clientToRevert.customerId, {
      onSuccess: () => setClientToRevert(null),
    });
  };

  const revertName = clientToRevert
    ? `${clientToRevert.firstName ?? ""} ${clientToRevert.lastName ?? ""}`.trim()
    : "";

  return (
    <div>
      <Header
        title="Clients"
        description="Your converted contacts — people who bring you real value."
      />

      <ClientTable onEdit={setClientToEdit} onRevert={setClientToRevert} />

      <EditClientModal
        isOpen={!!clientToEdit}
        onClose={() => setClientToEdit(null)}
        client={clientToEdit}
      />

      <ConfirmationModal
        isOpen={!!clientToRevert}
        title="Revert to contact"
        message={`"${revertName}" will be reverted back to a regular contact. Their client record will be removed.`}
        confirmLabel="Revert"
        onConfirm={handleRevertConfirm}
        onCancel={() => setClientToRevert(null)}
        isLoading={isReverting}
        variant="warning"
        icon={<RotateCcw />}
      />
    </div>
  );
};

export default ClientsPage;

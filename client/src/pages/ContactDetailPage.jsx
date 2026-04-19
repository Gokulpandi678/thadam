import { useState } from 'react';

import useCustomer from '../hooks/useCustomer';
import { useDeleteCustomer } from '../service/useCustomerApi';

const ContactDetails = ({ customer: initialCustomer, onDeleteSuccess }) => {
  const { customer, profileCompletion, handleEdit, handleLogMeeting, isEditing, cancelEdit } = useCustomer(initialCustomer);

  const [customerToDelete, setCustomerToDelete] = useState(null);
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

  return (
    <>
      <div
        className="grid gap-5 p-6 h-[87vh] overflow-hidden"
        style={{ gridTemplateColumns: '300px 1fr' }}
      >
        <div className="overflow-hidden">
          <Profilecard
            customer={customer}
            profileCompletion={profileCompletion}
            onEdit={handleEdit}
            onDelete={() => setCustomerToDelete(customer)}
          />
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto pr-1">
          <AdditionalDetails customer={customer} />
          <MeetingHistory customer={customer} onLogMeeting={handleLogMeeting} />
        </div>

        {isEditing && (
          <EditCustomerSidebar
            customer={customer}
            onClose={cancelEdit}
            isOpen={isEditing}
          />
        )}
      </div>

      <ConfirmationModal
        isOpen={!!customerToDelete}
        title="Delete customer"
        message={`"${getFullName(customerToDelete)}" will be permanently deleted and cannot be recovered.`}
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
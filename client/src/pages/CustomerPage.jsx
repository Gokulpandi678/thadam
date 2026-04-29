import { useContext, useState } from "react";
import { TriangleAlert } from "lucide-react";
import Header from "../ui/molecules/header/Header";
import { CustomerTable, EditCustomerSidebar } from "../features/customer/containers";
import { AddContactDrawer } from "../features/customer/components/form";
import { CustomerContext } from "../context/CustomerContext";
import { ConfirmationModal } from "../shared/components";
import { getFullName } from "../utils/customer.utils";
import { useGetCustomerById } from "../service/useCustomerApi";

const CustomerPage = () => {
  const [addOpen, setAddOpen] = useState(false);
  const { deleteCustomer, isDeleting } = useContext(CustomerContext);

  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const { data, isLoading: isLoadingDetail } = useGetCustomerById(selectedCustomerId);
  const customerDetail = data?.data?.result;

  const handleEdit = (customer) => {
    setSelectedCustomerId(customer?.id);
    setSidebarOpen(true);
  };

  const handleClose = () => {
    setSidebarOpen(false);
    setSelectedCustomerId(null);
  };

  const handleDeleteConfirm = () => {
    deleteCustomer(customerToDelete?.id, {
      onSuccess: () => setCustomerToDelete(null),
    });
  };

  return (
    <div>
      <AddContactDrawer isOpen={addOpen} onClose={() => setAddOpen(false)} />

      <Header title="Contacts" description="Manage your contacts. Log meetings." />

      <CustomerTable
        onEdit={handleEdit}
        onDelete={setCustomerToDelete}
        onAddClick={() => setAddOpen(true)}
      />

      <EditCustomerSidebar
        isOpen={isSidebarOpen}
        onClose={handleClose}
        customer={customerDetail}
        // isLoading={isLoadingDetail}
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
        icon={<TriangleAlert />}
      />
    </div>
  );
};

export default CustomerPage;
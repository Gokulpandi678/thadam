import { useContext, useState } from "react";
import Header from "../ui/molecules/header/Header";
import { CustomerTable } from "../features/customer/layout";
import EditCustomerSidebar from "../features/customer/layout/EditCustomerSidebar";
import { CustomerContext } from "../context/CustomerContext";
import ConfirmationModal from "../features/actions/ConfirmationModal";
import { TriangleAlert } from "lucide-react";

const CustomerPage = () => {
    const { customers, deleteCustomer, isDeleting } = useContext(CustomerContext);

    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(false);

    const handleEdit = (customer) => {
        setSelectedCustomer(customer);
        setSidebarOpen(true);
    };

    const handleClose = () => {
        setSidebarOpen(false);
        setSelectedCustomer(null);
    };

    const handleDeleteRequest = (customer) => setCustomerToDelete(customer);

    const handleDeleteConfirm = () => {
        deleteCustomer(customerToDelete?.id, {
            onSuccess: () => setCustomerToDelete(null),
        });
        setCustomerToDelete(false)
    };

    console.log(customerToDelete)

    return (
        <div>
            <Header
                title="Customer"
                description="Manage your customer. Log meetings."
            />

            <CustomerTable
                customers={customers}
                onEdit={handleEdit}
                onDelete={handleDeleteRequest}
            />

            <EditCustomerSidebar
                isOpen={isSidebarOpen}
                onClose={handleClose}
                customer={selectedCustomer}
            />

            <ConfirmationModal
                isOpen={customerToDelete}
                title="Delete customer"
                message={`"${customerToDelete?.firstName} ${customerToDelete?.lastName}" will be moved to the temporary delete bin and permanently deleted after 30 days.`}
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
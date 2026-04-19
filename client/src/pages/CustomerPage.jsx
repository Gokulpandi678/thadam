import { useContext, useState } from "react";
import Header from "../ui/molecules/header/Header";
import { CustomerTable } from "../features/customer/layout";
import EditCustomerSidebar from "../features/customer/layout/EditCustomerSidebar";
import { CustomerContext } from "../context/CustomerContext";

const CustomerPage = () => {
    const { customers, deleteCustomer } = useContext(CustomerContext);

    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const handleEdit = (customer) => {
        setSelectedCustomer(customer);
        setSidebarOpen(true);
    };

    const handleClose = () => {
        setSidebarOpen(false);
        setSelectedCustomer(null);
    };

    const handleDelete = (customer) => deleteCustomer(customer?.id);

    return (
        <div>
            <Header
                title="Customer"
                description="Manage your customer. Log meetings."
            />

            <CustomerTable
                customers={customers}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <EditCustomerSidebar
                isOpen={isSidebarOpen}
                onClose={handleClose}
                customer={selectedCustomer}
            />
        </div>
    );
};

export default CustomerPage;
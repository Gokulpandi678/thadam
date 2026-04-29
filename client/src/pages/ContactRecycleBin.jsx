import React from 'react'
import Header from '../ui/molecules/header/Header'
import { useGetDeletedCustomers, usePermanentlyDeleteCustomer, useRestoreCustomer } from '../service/useCustomerApi';
import DeletedContactCard from '../features/recycle-bin/DeletedContactCard';

const ContactRecycleBin = () => {
    const { data } = useGetDeletedCustomers();
    const { mutate: restoreCustomer } = useRestoreCustomer();
    const { mutate: deletePermanent } = usePermanentlyDeleteCustomer();

    const customer = data?.data?.result;

    const handleRestore = (customer) => {
        restoreCustomer({ id: customer.id });
    };

    const handlePermanentDelete = (customer) => {
        deletePermanent({ id: customer.id });
    };
    return (
        <div>
            <Header
                title="Recycle Bin"
                description="Deleted contacts live here. Restore to recover, or permanently delete to remove forever."
            />
            <div className='mt-5'>
                {
                    customer && customer.map((item, i) => (
                        <DeletedContactCard
                            key={i}
                            customer={item}
                            onDelete={handlePermanentDelete}
                            onRestore={handleRestore}
                        />
                    ))
                }
            </div>
        </div>
    )
}

export default ContactRecycleBin
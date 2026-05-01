import Header from "../ui/molecules/header/Header";
import { Loader2 } from "lucide-react";
import {
  useGetDeletedCustomers,
  usePermanentlyDeleteCustomer,
  useRestoreCustomer,
} from "../service/useCustomerApi";
import DeletedContactCard from "../features/recycle-bin/components/DeletedContactCard";

const ContactRecycleBin = () => {
  const { data, isLoading, error } = useGetDeletedCustomers();
  const { mutate: restoreCustomer } = useRestoreCustomer();
  const { mutate: deletePermanent } = usePermanentlyDeleteCustomer();

  const customers = data?.data?.result ?? [];

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
      {isLoading && (
        <div className="mt-10 flex items-center justify-center gap-2 text-slate-400">
          <Loader2 size={18} className="animate-spin text-blue-600" />
          <span className="text-sm">Loading deleted contacts...</span>
        </div>
      )}
      {!isLoading && error && (
        <div className="mt-8 rounded-2xl border border-red-100 bg-white px-6 py-5 text-sm text-red-500 shadow-sm">
          Unable to load deleted contacts. Please try again.
        </div>
      )}
      {!isLoading && !error && (
        <div className="mt-5 flex flex-col gap-3">
          {customers.map((item) => (
            <DeletedContactCard
              key={item.id}
              customer={item}
              onDelete={handlePermanentDelete}
              onRestore={handleRestore}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactRecycleBin;

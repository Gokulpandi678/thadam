import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Header from "../ui/molecules/header/Header";
import { useGetCustomerById } from "../service/useCustomerApi";
import { ContactDetails } from "../features/customer/containers";

const ContactDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetCustomerById(id ?? "");
  const customer = data?.data?.result ?? null;

  const handleDeleteSuccess = () => {
    navigate("/");
  };

  return (
    <div>
      <Header
        title="Contact Insights"
        description="Everything you need to know about this contact"
      />

      {isLoading && (
        <div className="flex items-center justify-center h-[calc(100vh-160px)]">
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <Loader2 size={28} className="animate-spin text-blue-600" />
            <span className="text-sm">Loading contact...</span>
          </div>
        </div>
      )}

      {!isLoading && error && (
        <div className="flex items-center justify-center h-[calc(100vh-160px)]">
          <div className="text-center px-10 py-8 bg-white rounded-2xl border border-red-100 shadow-sm">
            <p className="text-[15px] font-semibold text-red-500 mb-1.5">
              Something went wrong
            </p>
            <p className="text-[13px] text-slate-400">
              Unable to load contact details. Please try again.
            </p>
          </div>
        </div>
      )}

      {!isLoading && !error && customer && (
        <ContactDetails customer={customer} onDeleteSuccess={handleDeleteSuccess} />
      )}
    </div>
  );
};

export default ContactDetailPage;

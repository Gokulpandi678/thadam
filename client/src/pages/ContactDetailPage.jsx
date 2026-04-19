import { useParams, useNavigate } from 'react-router-dom';
import Header from '../ui/molecules/header/Header';
import { useGetCustomerById, useDeleteCustomer } from '../service/useCustomerApi';
import ContactDetails from '../features/customer/layout/ContactDetails';

const ContactDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetCustomerById(id ?? '');
  const { mutate: deleteCustomer } = useDeleteCustomer();

  const customer = data?.data?.result ?? null;

  const handleDelete = (customerData) => {
    deleteCustomer(
      { id: customerData.id },
      { onSuccess: () => navigate('/') }
    );
  };

  const handleEdit = (customerData) => {
    // Open your edit drawer/modal here, e.g.:
    // openEditDrawer(customerData);
    console.log('Edit customer:', customerData.id);
  };

  return (
    <div>
      <Header
        title="Contact Insights"
        description="Everything you need to know about this contact"
      />

      {/* Loading state */}
      {isLoading && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          height: 'calc(100vh - 160px)',
          color: '#94a3b8', fontSize: 14,
        }}>
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              border: '3px solid #e4e8f0', borderTopColor: '#2563eb',
              animation: 'spin 0.7s linear infinite',
            }} />
            <span>Loading contact...</span>
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Error state */}
      {!isLoading && error && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          height: 'calc(100vh - 160px)',
        }}>
          <div style={{
            textAlign: 'center', padding: '32px 40px',
            background: '#fff', borderRadius: 16,
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            border: '1px solid #fee2e2',
          }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#ef4444', marginBottom: 6 }}>
              Something went wrong
            </p>
            <p style={{ fontSize: 13, color: '#94a3b8' }}>
              Unable to load contact details. Please try again.
            </p>
          </div>
        </div>
      )}

      {/* Success state */}
      {!isLoading && !error && customer && (
        <ContactDetails
          customer={customer}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
};

export default ContactDetailPage;
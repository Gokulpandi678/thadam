import { useState, useCallback, useEffect } from 'react';
import { calcProfileCompletion } from '../utils/customer.utils';
import { useAddCustomerLog } from '../service/useCustomerApi';

const useCustomer = (initialCustomer) => {
  const [customer, setCustomer] = useState(initialCustomer ?? null);
  const [isEditing, setIsEditing] = useState(false);

  const addLogMutation = useAddCustomerLog();

  useEffect(() => {
    if (initialCustomer)
      setCustomer(initialCustomer);
  }, [initialCustomer]);

  const profileCompletion = calcProfileCompletion(customer);

  const handleEdit = useCallback(() => setIsEditing(true), []);
  const cancelEdit = useCallback(() => setIsEditing(false), []);

  const handleLogMeeting = useCallback((logData) => {
    if (!customer) return;

    addLogMutation.mutate(
      { customerId: customer.id, params: logData },
      {
        onSuccess: (response) => {
          const savedLog = response.data.result;
          setCustomer(prev =>
            prev ? { ...prev, logs: [savedLog, ...(prev.logs ?? [])] } : prev
          );
        },
      }
    );
  }, [customer, addLogMutation]);

  return {
    customer,
    isEditing,
    profileCompletion,
    setCustomer,
    handleEdit,
    cancelEdit,
    handleLogMeeting,
    isLoggingMeeting: addLogMutation.isPending,
  };
};

export default useCustomer;
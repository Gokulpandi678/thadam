/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useCallback, useEffect } from 'react';
import { calcProfileCompletion } from '../utils/customer.utils';
import { useAddCustomerLog, useDeleteCustomerLog, useEditCustomerLog } from '../service/useCustomerApi';

const useCustomer = (initialCustomer) => {
  const [customer, setCustomer] = useState(initialCustomer ?? null);
  const [isEditing, setIsEditing] = useState(false);

  const addLogMutation = useAddCustomerLog();
  const editLogMutation = useEditCustomerLog();
  const deleteLogMutation = useDeleteCustomerLog();

  useEffect(() => {
    if (initialCustomer)
      setCustomer(initialCustomer);
  }, [initialCustomer]);

  const profileCompletion = calcProfileCompletion(customer);

  const handleEdit = useCallback(() => setIsEditing(true), []);
  const cancelEdit = useCallback(() => setIsEditing(false), []);

  const handleLogMeeting = useCallback((logData) => {
    if (!customer) return;

    return addLogMutation
      .mutateAsync({ customerId: customer.id, params: logData })
      .then((response) => {
        const savedLog = response.data.result;
        setCustomer((prev) =>
          prev ? { ...prev, logs: [savedLog, ...(prev.logs ?? [])] } : prev
        );
        return response;
      });
  }, [customer, addLogMutation]);

  const handleEditLog = useCallback((logId, logData, callbacks = {}) => {
    if (!customer || !logId) return;

    return editLogMutation
      .mutateAsync({ customerId: customer.id, logId, params: logData })
      .then((response) => {
        const result = response?.data?.result;
        const updatedLog =
          result && typeof result === "object" && !Array.isArray(result)
            ? result
            : { id: logId, ...logData };
        setCustomer((prev) =>
          prev
            ? {
                ...prev,
                logs: (prev.logs ?? []).map((log) =>
                  log.id === logId ? { ...log, ...updatedLog } : log
                ),
              }
            : prev
        );
        callbacks.onSuccess?.(updatedLog);
        return response;
      });
  }, [customer, editLogMutation]);

  const handleDeleteLog = useCallback((logId, callbacks = {}) => {
    if (!customer || !logId) return;

    return deleteLogMutation
      .mutateAsync({ customerId: customer.id, logId })
      .then((response) => {
        setCustomer((prev) =>
          prev
            ? {
                ...prev,
                logs: (prev.logs ?? []).filter((log) => log.id !== logId),
              }
            : prev
        );
        callbacks.onSuccess?.();
        return response;
      });
  }, [customer, deleteLogMutation]);

  return {
    customer,
    isEditing,
    profileCompletion,
    setCustomer,
    handleEdit,
    cancelEdit,
    handleLogMeeting,
    handleEditLog,
    handleDeleteLog,
    isLoggingMeeting: addLogMutation.isPending,
    isEditingLog: editLogMutation.isPending,
    isDeletingLog: deleteLogMutation.isPending,
  };
};

export default useCustomer;

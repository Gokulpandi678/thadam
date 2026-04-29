export const qk = {
  allCustomers: (filterParams = {}) => ["allCustomer", filterParams],
  customer: (id) => ["customer", id],
  customerFilterOptions: () => ["customerFilterOptions"],
  deletedCustomers: () => ["deletedCustomers"],
  allClients: (filterParams = {}) => ["allClients", filterParams],
  client: (customerId) => ["client", customerId],
  clientFilterOptions: () => ["clientFilterOptions"],
  dashboard: () => ["dashboard"],
};

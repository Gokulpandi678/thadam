import { useContext } from "react";
import { ClientContext } from "../../../context/ClientContext";
import { GenericToolbar } from "../../../shared/components";

const FILTER_FIELDS = [
  { key: "clientType", label: "Client type" },
  { key: "engagementType", label: "Engagement" },
];

const ClientToolbar = ({ table, length }) => {
  const { search, setSearch, filters, toggleFilter, resetFilters, activeFilterCount, filterOptions } =
    useContext(ClientContext);

  return (
    <GenericToolbar
      filterFields={FILTER_FIELDS}
      filters={filters}
      toggleFilter={toggleFilter}
      resetFilters={resetFilters}
      activeFilterCount={activeFilterCount}
      filterOptions={filterOptions}
      search={search}
      setSearch={setSearch}
      table={table}
      length={length}
      entityLabel="clients"
    />
  );
};

export default ClientToolbar;

import { Plus } from "lucide-react";
import { useContext } from "react";
import { CustomerContext } from "../../../../context/CustomerContext";
import { TextButton } from "../../../../ui/atoms/button/Button";
import { GenericToolbar } from "../../../../shared/components";

const FILTER_FIELDS = [
  { key: "role", label: "Role" },
  { key: "designation", label: "Designation" },
  { key: "city", label: "City" },
];

const CustomerToolbar = ({ table, length, onAddClick }) => {
  const { search, setSearch, filters, toggleFilter, resetFilters, activeFilterCount, filterOptions } =
    useContext(CustomerContext);

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
      entityLabel="customers"
      rightSlot={
        <TextButton icon={<Plus />} onClick={onAddClick}>
          Add Contact
        </TextButton>
      }
    />
  );
};

export default CustomerToolbar;

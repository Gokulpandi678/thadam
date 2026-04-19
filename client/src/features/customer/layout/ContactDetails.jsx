import React from 'react';
import useCustomer from '../../../hooks/useCustomer';
import ProfileCard from '../component/detail/ProfileCard';
import EditCustomerSidebar from './EditCustomerSidebar';
import MeetingHistory from '../component/detail/MeetingHistory'
import AdditionalDetails from '../component/detail/AdditionalContactDetails';

const ContactDetails = ({ customer: initialCustomer, onDelete }) => {
  const { customer, profileCompletion, handleEdit, handleLogMeeting, isEditing, cancelEdit } = useCustomer(initialCustomer);

  const handleDelete = () => onDelete?.(customer);

  if (!customer) return null;

  return (
    <div
      className="grid gap-5 p-6 h-[87vh] overflow-hidden"
      style={{ gridTemplateColumns: '300px 1fr' }}
    >
      <div className="overflow-hidden">
        <ProfileCard
          customer={customer}
          profileCompletion={profileCompletion}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto pr-1">
        <AdditionalDetails customer={customer} />
        <MeetingHistory customer={customer} onLogMeeting={handleLogMeeting} />
      </div>

      {
        isEditing && 
        <EditCustomerSidebar 
        customer={customer} 
        onClose={cancelEdit}
        isOpen={isEditing}
      />
      }
    </div>
  );
};

export default ContactDetails;
import { Mail, Phone, MapPin, Tag, Trash2, Link, Pencil } from "lucide-react";
import { useMemo, useState } from "react";
import { getInitials, getFullName, getLocation, isClientContact } from "../../../../utils/customer.utils";
import { Avatar, InfoRow, RoleBadge } from "../../../../ui/atoms";
import { ConfirmationModal } from "../../../../shared/components";
import { useEditProfilePic, useDeleteProfilePic } from "../../../../service/useCustomerApi";
import { TextButton } from "../../../../ui/atoms/button/Button";

const ProfileCard = ({ customer, profileCompletion, onEdit, onConvertAsClient, onDelete }) => {
  const { mutateAsync: editProfilePic } = useEditProfilePic();
  const { mutateAsync: deleteProfilePic, isPending: isDeletingPic } = useDeleteProfilePic();
  const [showDeletePicModal, setShowDeletePicModal] = useState(false);

  const formattedCompanyDetail = useMemo(() => {
    if (customer.designation && customer.company)
      return `${customer.designation} - ${customer.company}`;
    if (customer.designation) return customer.designation;
    if (customer.company) return customer.company;
    return null;
  }, [customer]);

  if (!customer) return null;

  const handleEditPic = async (file) => {
    await editProfilePic({ id: customer.id, file });
  };

  const handleDeletePicConfirm = async () => {
    await deleteProfilePic({ id: customer.id });
    setShowDeletePicModal(false);
  };

  const canConvert = !isClientContact(customer);

  return (
    <>
      <div className="flex flex-col gap-2 items-center pt-7 px-5 pb-5 bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] relative">
        <div className="absolute top-0 left-0 right-0 h-18 bg-linear-to-br from-blue-600 to-blue-500" />

        {profileCompletion !== undefined && (
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-white border border-[#e4e8f0] rounded-full px-2 py-0.5 shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            <span className="text-[11px] font-bold text-blue-600 leading-[1.4]">
              {profileCompletion}%
            </span>
          </div>
        )}

        <div className="z-10 mb-2.5">
          <Avatar
            src={customer.profilePicture}
            initials={getInitials(customer)}
            size={72}
            editable
            onEditPic={handleEditPic}
            onDeletePic={() => setShowDeletePicModal(true)}
          />
        </div>

        <p className="text-[18px] font-bold tracking-tight mb-1.5 text-center text-blue-500">
          {getFullName(customer)}
        </p>
        {customer.role && <RoleBadge role={customer.role} />}

        <p className="text-xs font-bold text-slate-700 mt-1 mb-5">{formattedCompanyDetail}</p>

        <div className="w-full flex flex-col gap-3 mb-5">
          <InfoRow
            icon={<Mail size={15} />}
            label="Email"
            value={customer.primaryEmail}
            href={`mailto:${customer.primaryEmail}`}
            iconBg="#eff4ff"
            iconColor="#2563eb"
          />
          <InfoRow
            icon={<Phone size={15} />}
            label="Phone"
            value={customer.primaryContactNo}
            href={`tel:${customer.primaryContactNo}`}
            iconBg="#f5f3ff"
            iconColor="#7c3aed"
          />
          <InfoRow
            icon={<MapPin size={15} />}
            label="Location"
            value={getLocation(customer)}
            iconBg="#fffbeb"
            iconColor="#d97706"
          />
          {customer.socialLinkedin && (
            <InfoRow
              icon={<Link size={15} />}
              label="LinkedIn"
              value={customer.socialLinkedin.replace("https://", "")}
              href={customer.socialLinkedin}
              iconBg="#f0fdfa"
              iconColor="#0d9488"
            />
          )}
          {customer.referredBy && (
            <InfoRow
              icon={<Tag size={15} />}
              label="Referred By"
              value={customer.referredBy}
              iconBg="#fdf2f8"
              iconColor="#db2777"
            />
          )}
          {customer.socialTwitter && (
            <InfoRow
              icon={<Link size={15} />}
              label="Twitter"
              value={customer.socialTwitter.replace("https://", "")}
              href={customer.socialTwitter}
              iconBg="#eff6ff"
              iconColor="#1d9bf0"
            />
          )}
          {customer.socialYoutube && (
            <InfoRow
              icon={<Link size={15} />}
              label="YouTube"
              value={customer.socialYoutube.replace("https://", "")}
              href={customer.socialYoutube}
              iconBg="#fff1f2"
              iconColor="#dc2626"
            />
          )}
        </div>

        <div className="flex gap-2 w-full">
          <button
            onClick={onEdit}
            aria-label="Edit contact"
            className="w-9.5 flex-1 h-9.5 rounded-[10px] border border-blue-100 bg-blue-50 flex items-center justify-center cursor-pointer text-blue-500 transition-all duration-150 hover:bg-blue-500 hover:text-white shrink-0"
          >
            <Pencil size={15} />
          </button>

          {canConvert && (
            <TextButton onClick={onConvertAsClient}>Convert as Client</TextButton>
          )}

          <button
            onClick={onDelete}
            aria-label="Delete contact"
            className="w-9.5 h-9.5 flex-1 rounded-[10px] border border-red-100 bg-red-50 flex items-center justify-center cursor-pointer text-red-500 transition-all duration-150 hover:bg-red-500 hover:text-white shrink-0"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeletePicModal}
        title="Remove profile picture"
        message="Are you sure you want to remove this profile picture?"
        confirmLabel="Remove"
        onConfirm={handleDeletePicConfirm}
        onCancel={() => setShowDeletePicModal(false)}
        isLoading={isDeletingPic}
        variant="warning"
      />
    </>
  );
};

export default ProfileCard;

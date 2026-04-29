import { useState } from "react";
import { Plus } from "lucide-react";
import MeetingLogItem from "./MeetingLogItem";
import { TextButton } from "../../../../ui/atoms/button/Button";
import { ConfirmationModal } from "../../../../shared/components";
import { ContactDrawer, contactDrawerTabs } from "../form";

const toLogForm = (log) => ({
  meetingType: log?.type ?? "",
  meetingDate: log?.date ? String(log.date).split("T")[0] : log?.createdAt?.split("T")[0] ?? "",
  meetingDuration: log?.duration ?? "",
  meetingDescription: log?.description ?? "",
});

const MEETING_ONLY_TABS = [contactDrawerTabs.find((tab) => tab.label === "Meeting")].filter(Boolean);
const EMPTY_MEETING_FORM = toLogForm(null);

const MeetingHistory = ({
  customer,
  onLogMeeting,
  onEditLog,
  onDeleteLog,
  isLoggingMeeting = false,
  isEditingLog = false,
  isDeletingLog = false,
  embedded = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [logToDelete, setLogToDelete] = useState(null);
  const [form, setForm] = useState(EMPTY_MEETING_FORM);
  const [errors, setErrors] = useState({});

  const logs = customer?.logs ?? [];
  const firstName = customer?.firstName ?? "Contact";

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const validateMeetingForm = () => {
    const nextErrors = {};
    if (!form.meetingType) nextErrors.meetingType = "Meeting type is required";
    if (!form.meetingDate) nextErrors.meetingDate = "Date is required";
    if (!form.meetingDuration?.trim()) nextErrors.meetingDuration = "Duration is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const getPayload = () => ({
    type: form.meetingType,
    description: form.meetingDescription?.trim() || null,
    duration: form.meetingDuration?.trim() || null,
    date: form.meetingDate,
  });

  const openCreateDrawer = () => {
    setForm(EMPTY_MEETING_FORM);
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditDrawer = (log) => {
    setForm(toLogForm(log));
    setErrors({});
    setEditingLog(log);
  };

  const handleSubmit = async () => {
    if (!validateMeetingForm()) return false;
    return onLogMeeting?.(getPayload());
  };

  const handleEditSubmit = async () => {
    if (!editingLog) return;
    if (!validateMeetingForm()) return false;
    return onEditLog?.(editingLog.id, getPayload(), {
      onSuccess: () => setEditingLog(null),
    });
  };

  const handleDeleteConfirm = () => {
    if (!logToDelete) return;
    onDeleteLog?.(logToDelete.id, {
      onSuccess: () => setLogToDelete(null),
    });
  };

  const content = (
    <>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold tracking-[0.8px] uppercase text-slate-400">
            Meeting History
          </span>
          <span className="bg-blue-50 text-blue-600 text-[11px] font-bold px-2 py-0.5 rounded-full">
            {logs.length} total
          </span>
        </div>

        <TextButton onClick={openCreateDrawer} icon={<Plus />}>
          Log Meeting with {firstName}
        </TextButton>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-[13px]">
          No interactions logged yet.
        </div>
      ) : (
        <div>
          {logs.map((log, i) => (
            <MeetingLogItem
              key={log.id}
              log={log}
              isLast={i === logs.length - 1}
              onEdit={openEditDrawer}
              onDelete={setLogToDelete}
            />
          ))}
        </div>
      )}

      <ContactDrawer
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        mode="add"
        contact={customer}
        form={form}
        errors={errors}
        onChange={handleChange}
        tabs={MEETING_ONLY_TABS}
        submitLabel="Log Meeting"
        title={`Log meeting - ${firstName}`}
        subtitle="Add a new interaction for this contact"
        isPending={isLoggingMeeting}
      />

      <ContactDrawer
        isOpen={!!editingLog}
        onClose={() => setEditingLog(null)}
        onSubmit={handleEditSubmit}
        mode="edit"
        contact={customer}
        form={form}
        errors={errors}
        onChange={handleChange}
        tabs={MEETING_ONLY_TABS}
        title={`Edit meeting - ${firstName}`}
        subtitle="Update this meeting log"
        submitLabel="Save Changes"
        isPending={isEditingLog}
      />

      <ConfirmationModal
        isOpen={!!logToDelete}
        title="Delete meeting log"
        message="This meeting log will be permanently removed from this contact."
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setLogToDelete(null)}
        isLoading={isDeletingLog}
        variant="danger"
      />
    </>
  );

  if (embedded) return <div>{content}</div>;

  return (
    <div className="bg-white rounded-[20px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
      {content}
    </div>
  );
};

export default MeetingHistory;

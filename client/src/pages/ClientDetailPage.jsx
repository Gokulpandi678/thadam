import { useParams, useNavigate } from "react-router-dom";
import { Loader2, Pencil, RotateCcw, Tag, Users } from "lucide-react";
import { useState } from "react";
import Header from "../ui/molecules/header/Header";
import Avatar from "../ui/atoms/avatar/Avatar";
import MeetingHistory from "../features/customer/component/detail/MeetingHistory";
import ConfirmationModal from "../features/actions/ConfirmationModal";
import { useGetClientByCustomerId, useRevertClient } from "../service/useClientApi";
import { formatDate } from "../utils/customer.utils";
import EditClientModal from "../features/client/EditClientModal";

const InfoBlock = ({ label, value }) => (
    <div className="flex flex-col gap-0.5">
        <span className="text-[10px] uppercase tracking-[0.6px] text-slate-400 font-medium">{label}</span>
        <span className="text-[13px] text-slate-800 font-medium">{value ?? "—"}</span>
    </div>
);

const ClientDetailPage = () => {
    const { customerId } = useParams();
    const navigate = useNavigate();

    const { data, isLoading, error } = useGetClientByCustomerId(customerId);
    const client = data?.data?.result ?? null;

    const [showEdit, setShowEdit] = useState(false);
    const [showRevert, setShowRevert] = useState(false);

    const { mutate: revertClient, isPending: isReverting } = useRevertClient();

    const handleRevert = () => {
        revertClient(
            { customerId },
            { onSuccess: () => navigate("/clients") }
        );
    };

    const fullName = client
        ? `${client.firstName ?? ""} ${client.lastName ?? ""}`.trim()
        : "";

    const initials = client
        ? `${client.firstName?.[0] ?? ""}${client.lastName?.[0] ?? ""}`.toUpperCase()
        : "";

    return (
        <div>
            <Header
                title="Client Profile"
                description="Full client and contact details with meeting history"
            />

            {isLoading && (
                <div className="flex items-center justify-center h-[calc(100vh-160px)]">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                        <Loader2 size={28} className="animate-spin text-blue-600" />
                        <span className="text-sm">Loading client...</span>
                    </div>
                </div>
            )}

            {!isLoading && error && (
                <div className="flex items-center justify-center h-[calc(100vh-160px)]">
                    <div className="text-center px-10 py-8 bg-white rounded-2xl border border-red-100 shadow-sm">
                        <p className="text-[15px] font-semibold text-red-500 mb-1.5">Something went wrong</p>
                        <p className="text-[13px] text-slate-400">Unable to load client details.</p>
                    </div>
                </div>
            )}

            {!isLoading && !error && client && (
                <div
                    className="grid gap-5 p-6 h-[87vh] overflow-hidden"
                    style={{ gridTemplateColumns: "300px 1fr" }}
                >
                    {/* Left col */}
                    <div className="overflow-y-auto flex flex-col gap-4">

                        {/* Profile card */}
                        <div className="flex flex-col gap-2 items-center pt-7 px-5 pb-5 bg-white rounded-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-18 bg-gradient-to-br from-blue-600 to-blue-500" />

                            <div className="z-10 mb-2.5">
                                <Avatar src={client.profilePicture} initials={initials} size={72} />
                            </div>

                            <p className="text-[18px] font-bold tracking-tight mb-1.5 text-center text-blue-500">
                                {fullName}
                            </p>

                            <span className="inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600">
                                {client.clientType}
                            </span>

                            <p className="text-xs font-bold text-slate-700 mt-1 mb-3">
                                {client.designation}{client.company ? ` - ${client.company}` : ""}
                            </p>

                            <div className="flex gap-2 w-full mt-1">
                                <button
                                    onClick={() => navigate(`/customer/${customerId}`)}
                                    className="flex-1 py-2 rounded-[10px] border border-slate-200 bg-white text-[12px] font-medium text-slate-600 cursor-pointer transition-all hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 flex items-center justify-center gap-1.5"
                                >
                                    <Users size={13} /> View contact
                                </button>
                                <button
                                    onClick={() => setShowEdit(true)}
                                    className="w-9 h-9 rounded-[10px] border border-blue-100 bg-blue-50 flex items-center justify-center cursor-pointer text-blue-500 transition-all hover:bg-blue-500 hover:text-white shrink-0"
                                    title="Edit client"
                                >
                                    <Pencil size={15} />
                                </button>
                                <button
                                    onClick={() => setShowRevert(true)}
                                    className="w-9 h-9 rounded-[10px] border border-amber-100 bg-amber-50 flex items-center justify-center cursor-pointer text-amber-500 transition-all hover:bg-amber-500 hover:text-white shrink-0"
                                    title="Revert to contact"
                                >
                                    <RotateCcw size={15} />
                                </button>
                            </div>
                        </div>

                        {/* Client details card */}
                        <div className="bg-white rounded-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] px-5 py-5 flex flex-col gap-4">
                            <p className="text-[10px] uppercase tracking-[0.6px] text-slate-400 font-medium">
                                Client details
                            </p>
                            <InfoBlock label="Engagement type"         value={client.engagementType} />
                            <InfoBlock label="Client since"            value={formatDate(client.clientSince)} />
                            <InfoBlock label="Next follow-up"          value={formatDate(client.nextFollowUp)} />
                            <InfoBlock label="How they became a client" value={client.conversionReason} />
                            <InfoBlock label="Primary email"           value={client.primaryEmail} />
                            <InfoBlock label="Phone"                   value={client.primaryContactNo} />
                            <InfoBlock label="Location"                value={client.addressCity ? `${client.addressCity}, ${client.addressState ?? ""}`.trim().replace(/,$/, "") : null} />

                            {client.valueTags?.length > 0 && (
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[10px] uppercase tracking-[0.6px] text-slate-400 font-medium">
                                        What they bring
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {client.valueTags.map(tag => (
                                            <span
                                                key={tag}
                                                className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600"
                                            >
                                                <Tag size={10} /> {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {client.notes && (
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] uppercase tracking-[0.6px] text-slate-400 font-medium">
                                        Notes
                                    </span>
                                    <p className="text-[13px] text-slate-600 leading-relaxed">{client.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right col — reuse MeetingHistory directly, logs come from backend */}
                    <div className="flex flex-col gap-4 overflow-y-auto pr-1">
                        <MeetingHistory
                            customer={{ id: customerId, logs: client.logs ?? [] }}
                            onLogMeeting={() => {}}
                        />
                    </div>
                </div>
            )}

            <EditClientModal
                isOpen={showEdit}
                onClose={() => setShowEdit(false)}
                client={client}
            />

            <ConfirmationModal
                isOpen={showRevert}
                title="Revert to contact"
                message={`"${fullName}" will be reverted back to a regular contact. Their client record will be removed.`}
                confirmLabel="Revert"
                onConfirm={handleRevert}
                onCancel={() => setShowRevert(false)}
                isLoading={isReverting}
                variant="warning"
                icon={<RotateCcw />}
            />
        </div>
    );
};

export default ClientDetailPage;
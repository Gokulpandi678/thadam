import { useRef, useState } from "react";
import { Pencil, Trash2, X, ZoomIn } from "lucide-react";

const Avatar = ({ src, initials, size = 72, editable = false, onEditPic, onDeletePic }) => {
    const fileInputRef = useRef(null);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (!selected) return;
        onEditPic?.(selected);
        e.target.value = "";
    };

    return (
        <>
            <div className="relative inline-flex shrink-0" style={{ width: size, height: size }}>
                <div
                    style={{ width: size, height: size }}
                    className={`
                        rounded-full flex items-center justify-center overflow-hidden
                        shadow-[0_4px_16px_rgba(37,99,235,0.22)]
                        ${src ? "bg-transparent" : "bg-blue-500 border-2 border-white"}
                        ${src && editable ? "cursor-pointer" : ""}
                    `}
                    onClick={() => src && editable && setLightboxOpen(true)}
                    title={src && editable ? "View full image" : undefined}
                >
                    {src ? (
                        <img src={src} alt="profile" className="w-full h-full object-cover" />
                    ) : (
                        <span
                            className="font-bold text-white tracking-tight"
                            style={{ fontSize: size * 0.35 }}
                        >
                            {initials}
                        </span>
                    )}

                    {src && editable && (
                        <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                            <ZoomIn size={size * 0.3} className="text-white drop-shadow" />
                        </div>
                    )}
                </div>

                {editable && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                        }}
                        title="Change profile picture"
                        className="
                            absolute bottom-0 right-0
                            w-6 h-6 rounded-full
                            bg-blue-600 border-2 border-white
                            flex items-center justify-center
                            text-white shadow-md
                            hover:bg-blue-700 transition-colors cursor-pointer
                        "
                    >
                        <Pencil size={11} />
                    </button>
                )}

                {editable && src && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDeletePic?.();
                        }}
                        title="Remove profile picture"
                        className="
                            absolute bottom-0 left-0
                            w-6 h-6 rounded-full
                            bg-red-500 border-2 border-white
                            flex items-center justify-center
                            text-white shadow-md
                            hover:bg-red-600 transition-colors cursor-pointer
                        "
                    >
                        <Trash2 size={11} />
                    </button>
                )}

                {editable && (
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                )}
            </div>

            {lightboxOpen && src && (
                <div
                    className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 backdrop-blur-sm"
                    onClick={() => setLightboxOpen(false)}
                >
                    <div
                        className="relative max-w-sm w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={src}
                            alt="Profile full size"
                            className="w-full rounded-2xl shadow-2xl object-cover"
                        />
                        <button
                            onClick={() => setLightboxOpen(false)}
                            className="
                                absolute -top-3 -right-3
                                w-8 h-8 rounded-full
                                bg-white shadow-lg
                                flex items-center justify-center
                                text-slate-600 hover:text-slate-900
                                cursor-pointer transition-colors
                            "
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Avatar;
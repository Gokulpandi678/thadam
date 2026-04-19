import { useRef } from "react";

/**
 * ProfilePicture
 *
 * Props:
 *  - file         : File object (newly selected image)
 *  - setFile      : setter for File
 *  - existingUrl  : string URL of the already-saved profile picture (used in edit mode)
 */
const ProfilePicture = ({ file, setFile, existingUrl }) => {
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (!selected) return;
        setFile(selected);
    };

    // Priority: newly selected file > existing saved URL
    const previewSrc = file
        ? URL.createObjectURL(file)
        : existingUrl || null;

    return (
        <div className="flex flex-col gap-2 col-span-2">
            <label className="text-sm text-gray-500">Profile Picture</label>

            {previewSrc && (
                <img
                    src={previewSrc}
                    alt="Profile preview"
                    className="w-16 h-16 rounded-full object-cover border"
                />
            )}

            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-sm px-3 py-1 border rounded cursor-pointer"
            >
                {previewSrc ? "Change Photo" : "+ Add Photo"}
            </button>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    );
};

export default ProfilePicture;
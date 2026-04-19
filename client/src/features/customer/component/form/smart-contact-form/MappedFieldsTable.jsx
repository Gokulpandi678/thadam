import { Check, Pencil, Ticket, Trash, X } from "lucide-react";
import { useState } from "react";

const MappedFieldsTable = ({ mappedFields, onUpdate, onDelete }) => {
    const [editingKey, setEditingKey] = useState(null);
    const [editingValue, setEditingValue] = useState("");

    const startEdit = (key, value) => {
        setEditingKey(key);
        setEditingValue(value);
    };

    const confirmEdit = () => {
        onUpdate(editingKey, editingValue);
        setEditingKey(null);
        setEditingValue("");
    };

    const cancelEdit = () => {
        setEditingKey(null);
        setEditingValue("");
    };

    if (Object.keys(mappedFields).length === 0) return null;

    return (
        <table className="w-full mt-4 border border-gray-100 shadow rounded text-sm">
            <thead>
                <tr className="bg-gray-100 text-left text-gray-600">
                    <th className="px-4 py-2 font-medium">Field</th>
                    <th className="px-4 py-2 font-medium">Value</th>
                    <th className="px-4 py-2 font-medium">Action</th>
                </tr>
            </thead>
            <tbody>
                {Object.entries(mappedFields).map(([key, value]) => (
                    <tr key={key} className="border-t border-gray-200">

                        <td className="px-4 py-2 text-gray-600 capitalize">
                            {key.replace(/_/g, " ")}
                        </td>

                        <td className="px-4 py-2">
                            {editingKey === key ? (
                                <input
                                    className="w-full border rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-400"
                                    value={editingValue}
                                    onChange={(e) => setEditingValue(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") confirmEdit();
                                        if (e.key === "Escape") cancelEdit();
                                    }}
                                    autoFocus
                                />
                            ) : (
                                <span>{value}</span>
                            )}
                        </td>

                        <td className="px-4 py-2">
                            {editingKey === key ? (
                                <div className="flex gap-2">
                                    <button
                                        onClick={confirmEdit}
                                        className="text-green-500 hover:text-green-700 cursor-pointer"
                                    >
                                        <Check size={15}/>
                                    </button>
                                    <button
                                        onClick={cancelEdit}
                                        className="text-red-400 hover:text-red-600 cursor-pointer"
                                    >
                                        <X size={15}/>
                                    </button>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => startEdit(key, value)}
                                        className="text-blue-400 hover:text-blue-600 cursor-pointer"
                                    >
                                        <Pencil size={15}/>
                                    </button>
                                    <button
                                        onClick={() => onDelete(key)}
                                        className="text-red-400 hover:text-red-600 cursor-pointer"
                                    >
                                        <Trash size={15}/>
                                    </button>
                                </div>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default MappedFieldsTable;
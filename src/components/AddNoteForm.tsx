//   Component for adding new notes
import { useState } from "react";
import { MAX_NOTE_LENGTH } from "@/types/notes";

interface AddNoteFormProps {
  onAdd: (content: string) => Promise<boolean>;
  onCancel: () => void;
}

export const AddNoteForm = ({ onAdd, onCancel }: AddNoteFormProps) => {
  const [content, setContent] = useState("");
  const remainingChars = MAX_NOTE_LENGTH - content.length;

  //   Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.metaKey) {
      handleSave();
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  //   Handle save
  const handleSave = async () => {
    const success = await onAdd(content);
    if (success) {
      setContent("");
    }
  };

  return (
    <div className="mb-6">
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`w-full p-3 border rounded-lg mb-2 min-h-[100px] focus:outline-none focus:ring-2 ${
            remainingChars < 0
              ? "border-red-500 focus:ring-red-500"
              : remainingChars < 100
              ? "border-yellow-500 focus:ring-yellow-500"
              : "focus:ring-blue-500"
          }`}
          placeholder="Write your note here... (⌘+Enter to save, Esc to cancel)"
          autoFocus
        />
        <span
          className={`absolute bottom-4 right-4 text-sm ${
            remainingChars < 0
              ? "text-red-500"
              : remainingChars < 100
              ? "text-yellow-500"
              : "text-gray-500"
          }`}
        >
          {remainingChars} characters remaining
        </span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={!content.trim() || remainingChars < 0}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

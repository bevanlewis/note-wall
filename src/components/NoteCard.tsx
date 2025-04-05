//   Component for displaying a single note
import { useState } from "react";
import { Note, MAX_NOTE_LENGTH } from "@/types/notes";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2 } from "lucide-react";

interface NoteCardProps {
  note: Note;
  onUpdate: (id: string, content: string) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

export const NoteCard = ({ note, onUpdate, onDelete }: NoteCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(note.content);

  //   Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.metaKey) {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  //   Handle save
  const handleSave = async () => {
    const success = await onUpdate(note.id, editedContent);
    if (success) {
      setIsEditing(false);
    }
  };

  //   Handle cancel
  const handleCancel = () => {
    setIsEditing(false);
    setEditedContent(note.content);
  };

  return (
    <Card className="group relative break-inside-avoid">
      {isEditing ? (
        <>
          <CardContent className="p-4">
            <div className="relative">
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className={`w-full mb-2 min-h-[100px] max-h-[400px] resize-none ${
                  editedContent.length > MAX_NOTE_LENGTH
                    ? "border-destructive focus-visible:ring-destructive"
                    : editedContent.length > MAX_NOTE_LENGTH - 100
                    ? "border-yellow-500 focus-visible:ring-yellow-500"
                    : ""
                }`}
                placeholder="Edit your note... (⌘+Enter to save, Esc to cancel)"
                autoFocus
              />
              <span
                className={`absolute bottom-4 right-4 text-sm ${
                  editedContent.length > MAX_NOTE_LENGTH
                    ? "text-destructive"
                    : editedContent.length > MAX_NOTE_LENGTH - 100
                    ? "text-yellow-500"
                    : "text-muted-foreground"
                }`}
              >
                {MAX_NOTE_LENGTH - editedContent.length} characters remaining
              </span>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex gap-2">
            <Button
              onClick={handleSave}
              disabled={
                !editedContent.trim() || editedContent.length > MAX_NOTE_LENGTH
              }
              size="sm"
            >
              Save
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm">
              Cancel
            </Button>
          </CardFooter>
        </>
      ) : (
        <>
          {/* Action buttons overlay */}
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <Button
              onClick={() => setIsEditing(true)}
              variant="ghost"
              size="icon"
              className="h-8 w-8 bg-background/50 backdrop-blur-sm hover:bg-background/80 hover:text-blue-500 cursor-pointer"
              aria-label="Edit note"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => onDelete(note.id)}
              variant="ghost"
              size="icon"
              className="h-8 w-8 bg-background/50 backdrop-blur-sm hover:bg-background/80 hover:text-destructive cursor-pointer"
              aria-label="Delete note"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <CardContent className="p-4 max-h-[400px] overflow-y-auto whitespace-pre-wrap break-words">
            {note.content}
          </CardContent>
        </>
      )}
    </Card>
  );
};

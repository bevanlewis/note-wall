import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Notes = () => {
  const handleAddNote = () => {
    // Handle adding a new note
  };

  return (
    <div>
      <Button
        onClick={handleAddNote}
        className="fixed bottom-8 right-8 rounded-full w-12 h-12 bg-black hover:bg-black/90 text-white shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-110"
        size="icon"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default Notes;

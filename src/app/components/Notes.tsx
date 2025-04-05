"use client";

import { useState, useEffect, useRef } from "react";
import { useNotes } from "@/hooks/useNotes";
import { useAuth } from "@/contexts/AuthContext";
import { NoteCard } from "@/components/NoteCard";
import { AddNoteForm } from "@/components/AddNoteForm";
import { FeedbackMessage } from "@/components/FeedbackMessage";
import { AuthForm } from "@/components/AuthForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut } from "lucide-react";

export default function Notes() {
  //   State for managing UI
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Get auth context
  const { user, loading: authLoading, signOut } = useAuth();

  //   Use our custom hook for note management
  const {
    notes,
    isLoading,
    isSearching,
    feedback,
    loadNotes,
    searchNotes,
    addNote,
    updateNote,
    deleteNote,
  } = useNotes();

  //   Load notes on component mount and when user changes
  useEffect(() => {
    if (user) {
      loadNotes();
    }
  }, [user]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for cmd/ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault(); // Prevent browser's default action
        searchInputRef.current?.focus();
      }
    };

    // Add event listener
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []); // Empty dependency array since we don't use any dependencies

  //   Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchNotes(query);
  };

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show auth form if not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <AuthForm />
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto p-4">
        {/*   Feedback message */}
        {feedback && <FeedbackMessage message={feedback} />}

        {/*   Header section with search */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Quick Notes</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={signOut}
              className="h-10 w-10"
              aria-label="Sign out"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>

          {/*   Search input */}
          <div className="relative">
            <Input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search notes... (⌘/Ctrl + K to focus)"
              className="w-full"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
              </div>
            )}
          </div>
        </div>

        {/*   Note input section */}
        {isAddingNote && (
          <AddNoteForm
            onAdd={async (content) => {
              const success = await addNote(content);
              if (success) {
                setIsAddingNote(false);
              }
              return success;
            }}
            onCancel={() => setIsAddingNote(false)}
          />
        )}

        {/*   Notes display section */}
        {isLoading ? (
          <p className="text-muted-foreground text-center py-8">
            Loading notes...
          </p>
        ) : notes.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No notes yet. Click the + button to create one!
          </p>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onUpdate={updateNote}
                onDelete={deleteNote}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <Button
        onClick={() => setIsAddingNote(true)}
        className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg p-0"
        disabled={isLoading}
        aria-label="Add new note"
        size="lg"
      >
        <span className="text-2xl">+</span>
      </Button>
    </>
  );
}

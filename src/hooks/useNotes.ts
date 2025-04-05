//   Custom hook for managing notes
import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Note, FeedbackMessage, MAX_NOTE_LENGTH } from "@/types/notes";
import debounce from "lodash/debounce";

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  //   Function to show feedback messages
  const showFeedback = (type: FeedbackMessage["type"], text: string) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 3000);
  };

  //   Load notes from Supabase
  const loadNotes = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const notesWithDates = data.map((note) => ({
        ...note,
        created_at: new Date(note.created_at),
        updated_at: new Date(note.updated_at),
      }));

      setNotes(notesWithDates);
    } catch (err) {
      const error = err as Error;
      showFeedback(
        "error",
        error.message || "Failed to load notes. Please try refreshing the page."
      );
    } finally {
      setIsLoading(false);
    }
  };

  //   Search notes
  const searchNotes = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        loadNotes();
        return;
      }

      setIsSearching(true);
      try {
        const { data, error } = await supabase
          .from("notes")
          .select("*")
          .textSearch("content_tsv", query)
          .order("created_at", { ascending: false });

        if (error) throw error;

        const notesWithDates = data.map((note) => ({
          ...note,
          created_at: new Date(note.created_at),
          updated_at: new Date(note.updated_at),
        }));

        setNotes(notesWithDates);
      } catch (err) {
        const error = err as Error;
        showFeedback(
          "error",
          error.message || "Failed to search notes. Please try again."
        );
      } finally {
        setIsSearching(false);
      }
    }, 300),
    []
  );

  //   Add a new note
  const addNote = async (content: string) => {
    const trimmedContent = content.trim();

    if (!trimmedContent) {
      showFeedback("error", "Note cannot be empty");
      return false;
    }

    if (trimmedContent.length > MAX_NOTE_LENGTH) {
      showFeedback(
        "error",
        `Note is too long. Maximum ${MAX_NOTE_LENGTH} characters allowed.`
      );
      return false;
    }

    try {
      const { data, error } = await supabase
        .from("notes")
        .insert([{ content: trimmedContent }])
        .select()
        .single();

      if (error) throw error;

      const newNote: Note = {
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
      };

      setNotes([newNote, ...notes]);
      showFeedback("success", "Note added successfully!");
      return true;
    } catch (err) {
      const error = err as Error;
      showFeedback(
        "error",
        error.message || "Failed to add note. Please try again."
      );
      return false;
    }
  };

  //   Update a note
  const updateNote = async (id: string, content: string) => {
    const trimmedContent = content.trim();

    if (!trimmedContent) {
      showFeedback("error", "Note cannot be empty");
      return false;
    }

    if (trimmedContent.length > MAX_NOTE_LENGTH) {
      showFeedback(
        "error",
        `Note is too long. Maximum ${MAX_NOTE_LENGTH} characters allowed.`
      );
      return false;
    }

    try {
      const { data, error } = await supabase
        .from("notes")
        .update({
          content: trimmedContent,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      const updatedNote: Note = {
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
      };

      setNotes(notes.map((note) => (note.id === id ? updatedNote : note)));
      showFeedback("success", "Note updated successfully!");
      return true;
    } catch (err) {
      const error = err as Error;
      showFeedback(
        "error",
        error.message || "Failed to update note. Please try again."
      );
      return false;
    }
  };

  //   Delete a note
  const deleteNote = async (id: string) => {
    try {
      const { error } = await supabase.from("notes").delete().eq("id", id);

      if (error) throw error;

      setNotes(notes.filter((note) => note.id !== id));
      showFeedback("success", "Note deleted successfully!");
      return true;
    } catch (err) {
      const error = err as Error;
      showFeedback(
        "error",
        error.message || "Failed to delete note. Please try again."
      );
      return false;
    }
  };

  return {
    notes,
    isLoading,
    isSearching,
    feedback,
    loadNotes,
    searchNotes,
    addNote,
    updateNote,
    deleteNote,
  };
};

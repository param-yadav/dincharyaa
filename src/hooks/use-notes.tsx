
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";
import { toast } from "@/hooks/use-toast";

export interface Note {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchNotes = async () => {
    if (!user) {
      setNotes([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;

      setNotes(data as Note[]);
    } catch (error: any) {
      toast({
        title: "Error fetching notes",
        description: error.message,
        variant: "destructive",
      });
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (note: Omit<Note, "id" | "user_id" | "created_at" | "updated_at">) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create notes",
        variant: "destructive",
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("notes")
        .insert([{ ...note, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Note created",
        description: "Your note has been created successfully",
      });

      await fetchNotes();
      return data;
    } catch (error: any) {
      toast({
        title: "Error creating note",
        description: error.message,
        variant: "destructive",
      });
      console.error("Error creating note:", error);
      return null;
    }
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("notes")
        .update(updates)
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Note updated",
        description: "Your note has been updated successfully",
      });

      await fetchNotes();
    } catch (error: any) {
      toast({
        title: "Error updating note",
        description: error.message,
        variant: "destructive",
      });
      console.error("Error updating note:", error);
    }
  };

  const deleteNote = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Note deleted",
        description: "Your note has been deleted successfully",
      });

      await fetchNotes();
    } catch (error: any) {
      toast({
        title: "Error deleting note",
        description: error.message,
        variant: "destructive",
      });
      console.error("Error deleting note:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotes();

      const channel = supabase
        .channel('notes-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notes',
          },
          () => {
            fetchNotes();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  return {
    notes,
    loading,
    createNote,
    updateNote,
    deleteNote,
    fetchNotes
  };
};

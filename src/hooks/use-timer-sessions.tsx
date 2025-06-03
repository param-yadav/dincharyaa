
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";
import { toast } from "@/hooks/use-toast";

export interface TimerSession {
  id: string;
  user_id: string;
  duration: number;
  type: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export const useTimerSessions = () => {
  const [sessions, setSessions] = useState<TimerSession[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchSessions = async () => {
    if (!user) {
      setSessions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("timer_sessions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setSessions(data as TimerSession[]);
    } catch (error: any) {
      toast({
        title: "Error fetching timer sessions",
        description: error.message,
        variant: "destructive",
      });
      console.error("Error fetching timer sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const createSession = async (session: Omit<TimerSession, "id" | "user_id" | "created_at" | "updated_at">) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save timer sessions",
        variant: "destructive",
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("timer_sessions")
        .insert([{ ...session, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Session saved",
        description: "Your timer session has been saved successfully",
      });

      await fetchSessions();
      return data;
    } catch (error: any) {
      toast({
        title: "Error saving session",
        description: error.message,
        variant: "destructive",
      });
      console.error("Error saving session:", error);
      return null;
    }
  };

  const deleteSession = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("timer_sessions")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Session deleted",
        description: "Timer session has been deleted successfully",
      });

      await fetchSessions();
    } catch (error: any) {
      toast({
        title: "Error deleting session",
        description: error.message,
        variant: "destructive",
      });
      console.error("Error deleting session:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSessions();

      const channel = supabase
        .channel('timer-sessions-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'timer_sessions',
          },
          () => {
            fetchSessions();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  return {
    sessions,
    loading,
    createSession,
    deleteSession,
    fetchSessions
  };
};


import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";
import { toast } from "@/hooks/use-toast";

export interface Schedule {
  id: string;
  title: string;
  description?: string;
  date_from: string;
  date_to: string;
  is_all_day?: boolean;
  category?: string;
  color?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useSchedules = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchSchedules = async () => {
    if (!user) {
      setSchedules([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("schedules")
        .select("*")
        .order("date_from", { ascending: true });

      if (error) throw error;

      setSchedules(data as Schedule[]);
    } catch (error: any) {
      toast({
        title: "Error fetching schedules",
        description: error.message,
        variant: "destructive",
      });
      console.error("Error fetching schedules:", error);
    } finally {
      setLoading(false);
    }
  };

  const createSchedule = async (schedule: Omit<Schedule, "id" | "user_id" | "created_at" | "updated_at">) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create schedules",
        variant: "destructive",
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("schedules")
        .insert([{ ...schedule, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Schedule created",
        description: "Your schedule has been created successfully",
      });

      await fetchSchedules();
      return data;
    } catch (error: any) {
      toast({
        title: "Error creating schedule",
        description: error.message,
        variant: "destructive",
      });
      console.error("Error creating schedule:", error);
      return null;
    }
  };

  const updateSchedule = async (id: string, updates: Partial<Schedule>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("schedules")
        .update(updates)
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Schedule updated",
        description: "Your schedule has been updated successfully",
      });

      await fetchSchedules();
    } catch (error: any) {
      toast({
        title: "Error updating schedule",
        description: error.message,
        variant: "destructive",
      });
      console.error("Error updating schedule:", error);
    }
  };

  const deleteSchedule = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("schedules")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Schedule deleted",
        description: "Your schedule has been deleted successfully",
      });

      await fetchSchedules();
    } catch (error: any) {
      toast({
        title: "Error deleting schedule",
        description: error.message,
        variant: "destructive",
      });
      console.error("Error deleting schedule:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSchedules();

      const channel = supabase
        .channel('schedules-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'schedules',
          },
          () => {
            fetchSchedules();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  return {
    schedules,
    loading,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    fetchSchedules
  };
};

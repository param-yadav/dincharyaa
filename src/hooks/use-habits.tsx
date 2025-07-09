import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";
import { toast } from "@/hooks/use-toast";
import { ProductivityCategory } from "./use-productivity";

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  category: ProductivityCategory;
  target_frequency: string;
  target_count: number;
  reminder_time?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  date: string;
  count: number;
  completed: boolean;
  notes?: string;
  mood?: string;
  created_at: string;
}

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchHabits = async () => {
    if (!user) {
      setHabits([]);
      setHabitLogs([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Fetch habits
      const { data: habitsData, error: habitsError } = await supabase
        .from("habits")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (habitsError) throw habitsError;

      // Fetch recent habit logs
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: logsData, error: logsError } = await supabase
        .from("habit_logs")
        .select("*")
        .gte("date", thirtyDaysAgo.toISOString().split('T')[0])
        .order("date", { ascending: false });

      if (logsError) throw logsError;

      setHabits(habitsData || []);
      setHabitLogs(logsData || []);

    } catch (error: any) {
      toast({
        title: "Error fetching habits",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createHabit = async (habitData: Omit<Habit, "id" | "user_id" | "created_at" | "updated_at">) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from("habits")
        .insert([{ ...habitData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Habit created",
        description: "Your new habit has been created",
      });

      await fetchHabits();
      return data;
    } catch (error: any) {
      toast({
        title: "Error creating habit",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const logHabit = async (habitId: string, count: number = 1, notes?: string, mood?: string) => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];

    try {
      const { data, error } = await supabase
        .from("habit_logs")
        .upsert([{
          habit_id: habitId,
          user_id: user.id,
          date: today,
          count,
          completed: true,
          notes,
          mood
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Habit logged",
        description: "Great job! Keep it up!",
      });

      await fetchHabits();
      return data;
    } catch (error: any) {
      toast({
        title: "Error logging habit",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getHabitStreak = (habitId: string): number => {
    const logs = habitLogs.filter(log => log.habit_id === habitId && log.completed);
    if (logs.length === 0) return 0;

    // Sort by date descending
    const sortedLogs = logs.sort((a, b) => b.date.localeCompare(a.date));
    
    let streak = 0;
    let currentDate = new Date();
    
    for (const log of sortedLogs) {
      const logDate = new Date(log.date);
      const diffDays = Math.floor((currentDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === streak) {
        streak++;
        currentDate = logDate;
      } else if (diffDays > streak) {
        break;
      }
    }
    
    return streak;
  };

  const getTodaysProgress = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayLogs = habitLogs.filter(log => log.date === today);
    const completedToday = todayLogs.filter(log => log.completed).length;
    const totalHabits = habits.length;
    
    return {
      completed: completedToday,
      total: totalHabits,
      percentage: totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0
    };
  };

  useEffect(() => {
    if (user) {
      fetchHabits();

      const channel = supabase
        .channel('habits-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'habits',
          },
          () => fetchHabits()
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'habit_logs',
          },
          () => fetchHabits()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  return {
    habits,
    habitLogs,
    loading,
    createHabit,
    logHabit,
    getHabitStreak,
    getTodaysProgress,
    fetchHabits
  };
};
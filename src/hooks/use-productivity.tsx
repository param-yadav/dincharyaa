import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";
import { toast } from "@/hooks/use-toast";

export type ProductivityCategory = 'work' | 'study' | 'exercise' | 'personal' | 'break' | 'meeting' | 'project';
export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';
export type StatusType = 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'paused';

export interface TimeEntry {
  id: string;
  user_id: string;
  task_id?: string;
  goal_id?: string;
  category: ProductivityCategory;
  title: string;
  description?: string;
  start_time: string;
  end_time?: string;
  duration_minutes?: number;
  productivity_rating?: number;
  tags?: string[];
  location?: string;
  mood?: string;
  energy_level?: number;
  created_at: string;
  updated_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category: ProductivityCategory;
  priority: PriorityLevel;
  target_value?: number;
  current_value: number;
  target_date?: string;
  status: StatusType;
  created_at: string;
  updated_at: string;
}

export interface ProductivityInsight {
  id: string;
  user_id: string;
  date: string;
  total_productive_time: number;
  total_break_time: number;
  focus_score?: number;
  energy_trend?: number;
  mood_trend?: number;
  top_category?: ProductivityCategory;
  insights_data?: any;
  created_at: string;
}

export const useProductivity = () => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [insights, setInsights] = useState<ProductivityInsight[]>([]);
  const [currentEntry, setCurrentEntry] = useState<TimeEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch all productivity data
  const fetchData = async () => {
    if (!user) {
      setTimeEntries([]);
      setGoals([]);
      setInsights([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Fetch time entries
      const { data: entriesData, error: entriesError } = await supabase
        .from("time_entries")
        .select("*")
        .order("start_time", { ascending: false })
        .limit(100);

      if (entriesError) throw entriesError;

      // Fetch goals
      const { data: goalsData, error: goalsError } = await supabase
        .from("goals")
        .select("*")
        .order("created_at", { ascending: false });

      if (goalsError) throw goalsError;

      // Fetch recent insights
      const { data: insightsData, error: insightsError } = await supabase
        .from("productivity_insights")
        .select("*")
        .order("date", { ascending: false })
        .limit(30);

      if (insightsError) throw insightsError;

      setTimeEntries(entriesData || []);
      setGoals(goalsData || []);
      setInsights(insightsData || []);

      // Check for running entry
      const runningEntry = entriesData?.find(entry => !entry.end_time);
      setCurrentEntry(runningEntry || null);

    } catch (error: any) {
      toast({
        title: "Error fetching productivity data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Start time tracking
  const startTimeEntry = async (data: {
    title: string;
    category: ProductivityCategory;
    description?: string;
    task_id?: string;
    goal_id?: string;
  }) => {
    if (!user) return null;

    try {
      const { data: entry, error } = await supabase
        .rpc("start_time_entry", {
          p_user_id: user.id,
          p_title: data.title,
          p_category: data.category,
          p_description: data.description,
          p_task_id: data.task_id,
          p_goal_id: data.goal_id,
        });

      if (error) throw error;

      toast({
        title: "Time tracking started",
        description: `Started tracking "${data.title}"`,
      });

      await fetchData();
      return entry;
    } catch (error: any) {
      toast({
        title: "Error starting time entry",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  // Stop time tracking
  const stopTimeEntry = async (entryId: string, rating?: number, energyLevel?: number) => {
    if (!user) return;

    try {
      const updates: any = {
        end_time: new Date().toISOString(),
      };

      if (rating) updates.productivity_rating = rating;
      if (energyLevel) updates.energy_level = energyLevel;

      const { error } = await supabase
        .from("time_entries")
        .update(updates)
        .eq("id", entryId);

      if (error) throw error;

      // Auto-complete using the function
      await supabase.rpc("auto_complete_time_entry", { p_entry_id: entryId });

      toast({
        title: "Time tracking stopped",
        description: "Entry completed and saved",
      });

      await fetchData();
    } catch (error: any) {
      toast({
        title: "Error stopping time entry",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Create goal
  const createGoal = async (goalData: Omit<Goal, "id" | "user_id" | "created_at" | "updated_at" | "current_value">) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from("goals")
        .insert([{ ...goalData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Goal created",
        description: "Your goal has been created successfully",
      });

      await fetchData();
      return data;
    } catch (error: any) {
      toast({
        title: "Error creating goal",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  // Update goal progress
  const updateGoalProgress = async (goalId: string, currentValue: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("goals")
        .update({ current_value: currentValue })
        .eq("id", goalId);

      if (error) throw error;

      toast({
        title: "Goal updated",
        description: "Progress has been updated",
      });

      await fetchData();
    } catch (error: any) {
      toast({
        title: "Error updating goal",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Get today's summary
  const getTodaySummary = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayEntries = timeEntries.filter(entry => 
      entry.start_time.split('T')[0] === today
    );

    const totalTime = todayEntries.reduce((sum, entry) => 
      sum + (entry.duration_minutes || 0), 0
    );

    const productiveTime = todayEntries
      .filter(entry => entry.category !== 'break')
      .reduce((sum, entry) => sum + (entry.duration_minutes || 0), 0);

    const breakTime = todayEntries
      .filter(entry => entry.category === 'break')
      .reduce((sum, entry) => sum + (entry.duration_minutes || 0), 0);

    return {
      totalTime,
      productiveTime,
      breakTime,
      sessionsCount: todayEntries.length,
      avgProductivity: todayEntries.length > 0 
        ? todayEntries.reduce((sum, entry) => sum + (entry.productivity_rating || 0), 0) / todayEntries.length
        : 0
    };
  };

  useEffect(() => {
    if (user) {
      fetchData();

      // Set up real-time updates
      const channel = supabase
        .channel('productivity-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'time_entries',
          },
          () => fetchData()
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'goals',
          },
          () => fetchData()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  return {
    timeEntries,
    goals,
    insights,
    currentEntry,
    loading,
    startTimeEntry,
    stopTimeEntry,
    createGoal,
    updateGoalProgress,
    getTodaySummary,
    fetchData
  };
};
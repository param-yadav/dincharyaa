import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";
import { toast } from "@/hooks/use-toast";
import { ProductivityCategory, StatusType } from "./use-productivity";

export interface RoutineTemplate {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RoutineItem {
  id: string;
  template_id: string;
  title: string;
  description?: string;
  category: ProductivityCategory;
  start_time: string;
  duration_minutes: number;
  is_mandatory: boolean;
  order_index: number;
  created_at: string;
}

export interface DailyRoutine {
  id: string;
  user_id: string;
  template_id: string;
  date: string;
  completion_percentage: number;
  total_time_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface RoutineExecution {
  id: string;
  daily_routine_id: string;
  routine_item_id: string;
  time_entry_id?: string;
  status: StatusType;
  actual_start_time?: string;
  actual_end_time?: string;
  actual_duration_minutes?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const useRoutines = () => {
  const [templates, setTemplates] = useState<RoutineTemplate[]>([]);
  const [routineItems, setRoutineItems] = useState<RoutineItem[]>([]);
  const [dailyRoutines, setDailyRoutines] = useState<DailyRoutine[]>([]);
  const [executions, setExecutions] = useState<RoutineExecution[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchRoutines = async () => {
    if (!user) {
      setTemplates([]);
      setRoutineItems([]);
      setDailyRoutines([]);
      setExecutions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Fetch routine templates
      const { data: templatesData, error: templatesError } = await supabase
        .from("routine_templates")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (templatesError) throw templatesError;

      // Fetch routine items for active templates
      if (templatesData && templatesData.length > 0) {
        const templateIds = templatesData.map(t => t.id);
        
        const { data: itemsData, error: itemsError } = await supabase
          .from("routine_items")
          .select("*")
          .in("template_id", templateIds)
          .order("order_index", { ascending: true });

        if (itemsError) throw itemsError;
        setRoutineItems(itemsData || []);
      }

      // Fetch recent daily routines
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data: dailyData, error: dailyError } = await supabase
        .from("daily_routines")
        .select("*")
        .gte("date", sevenDaysAgo.toISOString().split('T')[0])
        .order("date", { ascending: false });

      if (dailyError) throw dailyError;

      setTemplates(templatesData || []);
      setDailyRoutines(dailyData || []);

    } catch (error: any) {
      toast({
        title: "Error fetching routines",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTemplate = async (templateData: Omit<RoutineTemplate, "id" | "user_id" | "created_at" | "updated_at">) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from("routine_templates")
        .insert([{ ...templateData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Routine template created",
        description: "Your routine template has been created",
      });

      await fetchRoutines();
      return data;
    } catch (error: any) {
      toast({
        title: "Error creating routine template",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const addRoutineItem = async (itemData: Omit<RoutineItem, "id" | "created_at">) => {
    try {
      const { data, error } = await supabase
        .from("routine_items")
        .insert([itemData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Routine item added",
        description: "Item added to your routine",
      });

      await fetchRoutines();
      return data;
    } catch (error: any) {
      toast({
        title: "Error adding routine item",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const startDailyRoutine = async (templateId: string, date?: string) => {
    if (!user) return null;

    const routineDate = date || new Date().toISOString().split('T')[0];

    try {
      const { data, error } = await supabase
        .from("daily_routines")
        .upsert([{
          user_id: user.id,
          template_id: templateId,
          date: routineDate,
          completion_percentage: 0,
          total_time_minutes: 0
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Daily routine started",
        description: "Your routine for today has been started",
      });

      await fetchRoutines();
      return data;
    } catch (error: any) {
      toast({
        title: "Error starting daily routine",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const getTodaysRoutine = (templateId: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dailyRoutines.find(dr => 
      dr.template_id === templateId && dr.date === today
    );
  };

  const getRoutineItems = (templateId: string) => {
    return routineItems.filter(item => item.template_id === templateId);
  };

  useEffect(() => {
    if (user) {
      fetchRoutines();

      const channel = supabase
        .channel('routines-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'routine_templates',
          },
          () => fetchRoutines()
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'routine_items',
          },
          () => fetchRoutines()
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'daily_routines',
          },
          () => fetchRoutines()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  return {
    templates,
    routineItems,
    dailyRoutines,
    executions,
    loading,
    createTemplate,
    addRoutineItem,
    startDailyRoutine,
    getTodaysRoutine,
    getRoutineItems,
    fetchRoutines
  };
};

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";
import { toast } from "@/hooks/use-toast";

export interface Task {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time?: string;
  priority: "low" | "medium" | "high";
  category: string;
  is_pinned: boolean;
  assigned_to?: string;
  assigned_user_id?: string;
  completed: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
  reminder_time?: string;
  reminder_sent?: boolean;
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch tasks from the database
  const fetchTasks = async () => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("is_pinned", { ascending: false }) // Pinned tasks first
        .order("start_time", { ascending: true });
        
      if (error) {
        throw error;
      }
      
      // Ensure that the priority field is always one of the expected values
      const typedData = data?.map(task => ({
        ...task,
        priority: validatePriority(task.priority)
      })) || [];
      
      setTasks(typedData as Task[]);
      
      // Check for tasks that need reminders
      checkForReminders(typedData as Task[]);
    } catch (error: any) {
      toast({
        title: "Error fetching tasks",
        description: error.message,
        variant: "destructive",
      });
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Check for tasks that need reminders
  const checkForReminders = (taskList: Task[]) => {
    if (!taskList?.length) return;
    
    const now = new Date();
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60000);
    
    taskList.forEach(task => {
      const startTime = new Date(task.start_time);
      
      // If the task starts within the next 5 minutes and a reminder hasn't been sent
      if (!task.completed && !task.reminder_sent && 
          startTime > now && startTime <= fiveMinutesFromNow) {
        // Send a reminder
        toast({
          title: "Task Reminder",
          description: `"${task.title}" starts at ${startTime.toLocaleTimeString()}`,
        });
        
        // Update the task to mark reminder as sent
        updateTask(task.id, { reminder_sent: true });
      }
    });
  };

  // Validate and normalize priority values
  const validatePriority = (priority: string | null): "low" | "medium" | "high" => {
    if (priority === "low" || priority === "medium" || priority === "high") {
      return priority;
    }
    return "medium"; // Default to medium if not valid
  };

  // Create a new task
  const createTask = async (task: Omit<Task, "id" | "user_id" | "created_at" | "updated_at">) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create tasks",
        variant: "destructive",
      });
      return null;
    }

    try {
      // Check if task has assigned_to and look up assigned_user_id
      let assigned_user_id = undefined;
      
      if (task.assigned_to && task.assigned_to !== "Me" && task.assigned_to.includes("@")) {
        const { data, error } = await supabase
          .rpc("find_user_id_by_email", { email: task.assigned_to });
          
        if (!error && data) {
          assigned_user_id = data;
        }
      }

      // Calculate reminder time (15 minutes before start time by default)
      let reminder_time = undefined;
      if (task.start_time) {
        const startTime = new Date(task.start_time);
        const reminderTime = new Date(startTime.getTime() - 15 * 60000); // 15 minutes before
        reminder_time = reminderTime.toISOString();
      }

      const newTask = {
        ...task,
        user_id: user.id,
        assigned_user_id,
        reminder_time,
        reminder_sent: false
      };
      
      const { data, error } = await supabase
        .from("tasks")
        .insert([newTask])
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Task created",
        description: "Your task has been created successfully",
      });
      
      await fetchTasks();
      return data;
    } catch (error: any) {
      toast({
        title: "Error creating task",
        description: error.message,
        variant: "destructive",
      });
      console.error("Error creating task:", error);
      return null;
    }
  };

  // Update an existing task
  const updateTask = async (id: string, updates: Partial<Task>) => {
    if (!user) return;

    try {
      // Ensure priority is valid if it's being updated
      if (updates.priority) {
        updates.priority = validatePriority(updates.priority as string);
      }

      const { error } = await supabase
        .from("tasks")
        .update(updates)
        .eq("id", id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully",
      });
      
      await fetchTasks();
    } catch (error: any) {
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive",
      });
      console.error("Error updating task:", error);
    }
  };

  // Delete a task
  const deleteTask = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Task deleted",
        description: "Your task has been deleted successfully",
      });
      
      await fetchTasks();
    } catch (error: any) {
      toast({
        title: "Error deleting task",
        description: error.message,
        variant: "destructive",
      });
      console.error("Error deleting task:", error);
    }
  };

  // Toggle pin status
  const togglePinTask = async (id: string, isPinned: boolean) => {
    await updateTask(id, { is_pinned: !isPinned });
  };

  // Toggle completion status
  const toggleCompleteTask = async (id: string, isCompleted: boolean) => {
    await updateTask(id, { completed: !isCompleted });
  };

  // Set up real-time updates and reminder checker
  useEffect(() => {
    if (!user) return;

    fetchTasks();

    // Check for reminders every minute
    const reminderInterval = setInterval(() => {
      if (tasks.length > 0) {
        checkForReminders(tasks);
      }
    }, 60000);

    // Subscribe to real-time updates
    const channel = supabase
      .channel('tasks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
        },
        (payload) => {
          console.log('Real-time update:', payload);
          fetchTasks();
        }
      )
      .subscribe();

    return () => {
      clearInterval(reminderInterval);
      supabase.removeChannel(channel);
    };
  }, [user, tasks]);

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    togglePinTask,
    toggleCompleteTask,
    fetchTasks
  };
};

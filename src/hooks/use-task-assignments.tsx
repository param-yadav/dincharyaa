
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";
import { toast } from "@/hooks/use-toast";
import { Task } from "@/hooks/use-tasks";

export interface TaskAssignment {
  id: string;
  task_id: string;
  assigned_by: string;
  assigned_to: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
  rejection_reason?: string;
}

export interface AssignTaskParams {
  task: Task;
  assignees: string[];
  message?: string;
}

export const useTaskAssignments = () => {
  const [assignments, setAssignments] = useState<TaskAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch all task assignments for the current user (both sent and received)
  const fetchAssignments = async () => {
    if (!user) {
      setAssignments([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Fetch assignments where the user is either the assigner or assignee
      const { data, error } = await supabase
        .from("task_assignments")
        .select("*")
        .or(`assigned_by.eq.${user.id},assigned_to.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      setAssignments(data || []);
    } catch (error: any) {
      console.error("Error fetching task assignments:", error);
      toast({
        title: "Error",
        description: "Failed to load task assignments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Assign a task to multiple users
  const assignTask = async ({ task, assignees, message }: AssignTaskParams) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to assign tasks",
        variant: "destructive",
      });
      return [];
    }

    try {
      const assignments: TaskAssignment[] = [];

      // Create an assignment record for each assignee
      for (const assignee of assignees) {
        // Look up the user ID if an email was provided
        let assigneeId = assignee;
        
        if (assignee.includes('@')) {
          const { data: userId, error: lookupError } = await supabase
            .rpc("find_user_id_by_email", { email: assignee });
          
          if (lookupError || !userId) {
            toast({
              title: "User Not Found",
              description: `Could not find user with email: ${assignee}`,
              variant: "destructive",
            });
            continue;
          }
          
          assigneeId = userId;
        }
        
        // Create the assignment record
        const { data, error } = await supabase
          .from("task_assignments")
          .insert({
            task_id: task.id,
            assigned_by: user.id,
            assigned_to: assigneeId,
            status: "pending",
            message: message || null
          })
          .select()
          .single();
        
        if (error) throw error;
        
        if (data) {
          assignments.push(data as unknown as TaskAssignment);
          
          // Create a notification for the assignee
          await supabase
            .from("notifications")
            .insert({
              user_id: assigneeId,
              type: "task_assignment",
              title: "New Task Assignment",
              message: `You have been assigned a new task: ${task.title}`,
              related_id: task.id,
              read: false
            });
        }
      }

      toast({
        title: "Task Assigned",
        description: `Task assigned to ${assignments.length} ${assignments.length === 1 ? 'user' : 'users'}`,
      });
      
      await fetchAssignments();
      return assignments;
    } catch (error: any) {
      console.error("Error assigning task:", error);
      toast({
        title: "Error",
        description: "Failed to assign task",
        variant: "destructive",
      });
      return [];
    }
  };

  // Respond to a task assignment (accept or reject)
  const respondToAssignment = async (assignmentId: string, accept: boolean, rejectionReason?: string) => {
    if (!user) return false;

    try {
      const status = accept ? "accepted" : "rejected";
      
      // Update the assignment status
      const { data, error } = await supabase
        .from("task_assignments")
        .update({ 
          status, 
          rejection_reason: accept ? null : (rejectionReason || null),
          updated_at: new Date().toISOString()
        })
        .eq("id", assignmentId)
        .eq("assigned_to", user.id) // Make sure the current user is the assignee
        .select()
        .single();
        
      if (error) throw error;
      
      if (!data) return false;

      // Get task details to use in notifications
      const { data: taskData } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", data.task_id)
        .single();
      
      // If accepted, create a copy of the task for the assignee
      if (accept && taskData) {
        const newTask = {
          title: taskData.title,
          description: taskData.description,
          start_time: taskData.start_time,
          end_time: taskData.end_time,
          priority: taskData.priority,
          category: taskData.category,
          assigned_by: data.assigned_by,
          is_pinned: false,
          completed: false,
          user_id: user.id
        };
        
        await supabase.from("tasks").insert(newTask);
      }
      
      // Create a notification for the assigner
      await supabase
        .from("notifications")
        .insert({
          user_id: data.assigned_by,
          type: "task_response",
          title: accept ? "Task Accepted" : "Task Rejected",
          message: accept 
            ? `Your task assignment was accepted by ${user.email}`
            : `Your task assignment was rejected by ${user.email}${rejectionReason ? `: ${rejectionReason}` : ''}`,
          related_id: data.task_id,
          read: false
        });
        
      toast({
        title: accept ? "Task Accepted" : "Task Rejected",
        description: accept ? "The task has been added to your tasks" : "The task assignment has been rejected",
      });
      
      await fetchAssignments();
      return true;
    } catch (error: any) {
      console.error("Error responding to task assignment:", error);
      toast({
        title: "Error",
        description: "Failed to respond to the task assignment",
        variant: "destructive",
      });
      return false;
    }
  };

  // Set up initial data fetching
  useEffect(() => {
    if (user) {
      fetchAssignments();
      
      // Subscribe to realtime updates for task_assignments
      const channel = supabase
        .channel('task-assignments-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'task_assignments' },
          (payload) => {
            console.log('Real-time update for task assignments:', payload);
            fetchAssignments();
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  return {
    assignments,
    loading,
    assignTask,
    respondToAssignment,
    fetchAssignments
  };
};

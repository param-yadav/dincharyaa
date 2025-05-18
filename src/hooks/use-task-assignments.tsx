
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
  message?: string;
  task?: Task;
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
      
      // Using our custom RPC function with a more specific query to avoid ambiguous columns
      const { data, error } = await supabase
        .rpc('get_user_task_assignments', { user_id: user.id });

      if (error) throw error;
      
      if (data) {
        // Cast the JSON data to TaskAssignment[] with type assertion
        setAssignments(data as unknown as TaskAssignment[]);
      } else {
        setAssignments([]);
      }
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
  const assignTask = async ({ task, assignees, message }: AssignTaskParams): Promise<TaskAssignment[]> => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to assign tasks",
        variant: "destructive",
      });
      return [];
    }

    try {
      const createdAssignments: TaskAssignment[] = [];

      // Create an assignment record for each assignee
      for (const assignee of assignees) {
        // Look up the user ID if an email was provided
        let assigneeId = assignee;
        
        if (assignee.includes('@')) {
          const { data: userId, error: lookupError } = await supabase
            .rpc('find_user_id_by_email', { email: assignee });
          
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
        
        // Create the assignment record using our RPC function
        const { data, error } = await supabase
          .rpc('create_task_assignment', {
            p_task_id: task.id,
            p_assigned_by: user.id,
            p_assigned_to: assigneeId,
            p_message: message || null
          });
        
        if (error) throw error;
        
        if (data) {
          // Cast the return data to TaskAssignment
          createdAssignments.push(data as unknown as TaskAssignment);
          
          // Create a notification using our RPC function
          await supabase
            .rpc('create_assignment_notification', {
              p_user_id: assigneeId,
              p_title: "New Task Assignment",
              p_message: `You have been assigned a new task: ${task.title}`,
              p_related_id: task.id
            });
        }
      }

      toast({
        title: "Task Assigned",
        description: `Task assigned to ${createdAssignments.length} ${createdAssignments.length === 1 ? 'user' : 'users'}`,
      });
      
      await fetchAssignments();
      return createdAssignments;
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
  const respondToAssignment = async (assignmentId: string, accept: boolean, rejectionReason?: string): Promise<boolean> => {
    if (!user) return false;

    try {
      // Using our custom RPC function to respond to assignment
      const { data, error } = await supabase
        .rpc('respond_to_task_assignment', {
          p_assignment_id: assignmentId,
          p_accept: accept,
          p_rejection_reason: rejectionReason || null
        });
        
      if (error) throw error;
      
      if (data === null) return false;

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
      
      // Subscribe to realtime updates for notifications table as a proxy for assignments
      const channel = supabase
        .channel('task-assignments-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'notifications' },
          (payload) => {
            // Only refresh if it's a task assignment notification
            if (payload.new && (
              (payload.new as any).type === 'task_assignment' || 
              (payload.new as any).type === 'task_response'
            )) {
              fetchAssignments();
            }
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

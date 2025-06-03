
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
  const [loading, setLoading] = useState(false);
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
      
      // Simple query to get assignments without using RPC initially
      const { data, error } = await supabase
        .from('task_assignments')
        .select(`
          *,
          tasks (
            id,
            title,
            description,
            start_time,
            priority
          )
        `)
        .or(`assigned_to.eq.${user.id},assigned_by.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching task assignments:", error);
        // Don't show error toast on initial load failure
        setAssignments([]);
        return;
      }
      
      if (data) {
        const formattedAssignments = data.map(assignment => ({
          ...assignment,
          task: assignment.tasks
        }));
        setAssignments(formattedAssignments);
      } else {
        setAssignments([]);
      }
    } catch (error: any) {
      console.error("Error fetching task assignments:", error);
      setAssignments([]);
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
          const { data: foundUser, error: lookupError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', assignee)
            .single();
          
          if (lookupError || !foundUser) {
            // Try to find by email in auth.users using RPC
            const { data: userId, error: rpcError } = await supabase
              .rpc('find_user_id_by_email', { email: assignee });
            
            if (rpcError || !userId) {
              toast({
                title: "User Not Found",
                description: `Could not find user with email: ${assignee}`,
                variant: "destructive",
              });
              continue;
            }
            
            assigneeId = userId;
          } else {
            assigneeId = foundUser.id;
          }
        }
        
        // Create the assignment record
        const { data, error } = await supabase
          .from('task_assignments')
          .insert({
            task_id: task.id,
            assigned_by: user.id,
            assigned_to: assigneeId,
            message: message || null,
            status: 'pending'
          })
          .select()
          .single();
        
        if (error) {
          console.error("Error creating assignment:", error);
          toast({
            title: "Error",
            description: "Failed to create task assignment",
            variant: "destructive",
          });
          continue;
        }
        
        if (data) {
          createdAssignments.push(data);
          
          // Create a notification
          await supabase
            .from('notifications')
            .insert({
              user_id: assigneeId,
              title: "New Task Assignment",
              message: `You have been assigned a new task: ${task.title}`,
              type: 'task_assignment',
              related_id: task.id
            });
        }
      }

      if (createdAssignments.length > 0) {
        toast({
          title: "Task Assigned",
          description: `Task assigned to ${createdAssignments.length} ${createdAssignments.length === 1 ? 'user' : 'users'}`,
        });
        
        await fetchAssignments();
      }
      
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
      const { error } = await supabase
        .from('task_assignments')
        .update({
          status: accept ? 'accepted' : 'rejected',
          rejection_reason: rejectionReason || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', assignmentId);
        
      if (error) throw error;

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

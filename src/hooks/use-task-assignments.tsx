
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
            priority,
            category,
            is_pinned,
            completed,
            user_id,
            created_at,
            updated_at
          )
        `)
        .or(`assigned_to.eq.${user.id},assigned_by.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching task assignments:", error);
        setAssignments([]);
        return;
      }
      
      if (data) {
        const formattedAssignments: TaskAssignment[] = data.map(assignment => ({
          id: assignment.id,
          task_id: assignment.task_id,
          assigned_by: assignment.assigned_by,
          assigned_to: assignment.assigned_to,
          status: assignment.status as 'pending' | 'accepted' | 'rejected',
          created_at: assignment.created_at,
          updated_at: assignment.updated_at,
          rejection_reason: assignment.rejection_reason || undefined,
          message: assignment.message || undefined,
          task: assignment.tasks ? {
            id: assignment.tasks.id,
            title: assignment.tasks.title,
            description: assignment.tasks.description || '',
            start_time: assignment.tasks.start_time,
            priority: assignment.tasks.priority || 'medium',
            category: assignment.tasks.category || 'Work',
            is_pinned: assignment.tasks.is_pinned || false,
            completed: assignment.tasks.completed || false,
            user_id: assignment.tasks.user_id || '',
            created_at: assignment.tasks.created_at || '',
            updated_at: assignment.tasks.updated_at || ''
          } : undefined
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
          const formattedAssignment: TaskAssignment = {
            id: data.id,
            task_id: data.task_id,
            assigned_by: data.assigned_by,
            assigned_to: data.assigned_to,
            status: data.status as 'pending' | 'accepted' | 'rejected',
            created_at: data.created_at,
            updated_at: data.updated_at,
            rejection_reason: data.rejection_reason || undefined,
            message: data.message || undefined,
            task: task
          };
          
          createdAssignments.push(formattedAssignment);
          
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

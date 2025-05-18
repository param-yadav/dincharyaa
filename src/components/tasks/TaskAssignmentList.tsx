
import React, { useState } from "react";
import { format } from "date-fns";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, User } from "lucide-react";
import { TaskAssignment, useTaskAssignments } from "@/hooks/use-task-assignments";
import { Task } from "@/hooks/use-tasks";

interface TaskAssignmentListProps {
  tasks: Task[];
  showSent?: boolean;
  showReceived?: boolean;
}

const TaskAssignmentList: React.FC<TaskAssignmentListProps> = ({ 
  tasks,
  showSent = true,
  showReceived = true
}) => {
  const { assignments, loading, respondToAssignment } = useTaskAssignments();
  const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({});
  const [showRejectionForm, setShowRejectionForm] = useState<Record<string, boolean>>({});

  // Filter assignments based on props
  const filteredAssignments = assignments.filter(assignment => {
    if (showSent && !showReceived) return assignment.status === "pending";
    if (showReceived && !showSent) return assignment.status !== "pending";
    return true;
  });

  // Get task details for an assignment
  const getTaskForAssignment = (taskId: string): Task | undefined => {
    return tasks.find(task => task.id === taskId);
  };

  const handleAccept = async (assignment: TaskAssignment) => {
    await respondToAssignment(assignment.id, true);
  };

  const handleReject = async (assignment: TaskAssignment) => {
    const reason = rejectionReasons[assignment.id] || "";
    await respondToAssignment(assignment.id, false, reason);
    
    // Clear form state
    setShowRejectionForm(prev => ({
      ...prev,
      [assignment.id]: false
    }));
    setRejectionReasons(prev => ({
      ...prev,
      [assignment.id]: ""
    }));
  };

  const toggleRejectionForm = (assignmentId: string) => {
    setShowRejectionForm(prev => ({
      ...prev,
      [assignmentId]: !prev[assignmentId]
    }));
  };

  const handleReasonChange = (assignmentId: string, reason: string) => {
    setRejectionReasons(prev => ({
      ...prev,
      [assignmentId]: reason
    }));
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <Clock className="animate-spin h-8 w-8 mx-auto text-dincharya-primary" />
        <p className="mt-2 text-muted-foreground">Loading assignments...</p>
      </div>
    );
  }

  if (filteredAssignments.length === 0) {
    return (
      <div className="text-center py-8">
        <User className="h-12 w-12 mx-auto text-muted-foreground/50" />
        <h3 className="mt-4 font-medium">No Task Assignments</h3>
        <p className="text-muted-foreground mt-2">
          {showReceived && !showSent
            ? "You don't have any pending task assignments"
            : "You haven't assigned tasks to anyone yet"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredAssignments.map((assignment) => {
        const task = getTaskForAssignment(assignment.task_id);
        const isPending = assignment.status === "pending";
        
        return (
          <Card key={assignment.id} className={cn(
            "transition-all",
            isPending 
              ? "border-amber-200 dark:border-amber-800" 
              : assignment.status === "accepted"
                ? "border-green-200 dark:border-green-800"
                : "border-red-200 dark:border-red-800"
          )}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base">
                    {task?.title || "Unknown Task"}
                  </CardTitle>
                  <CardDescription>
                    {isPending
                      ? "Waiting for response"
                      : assignment.status === "accepted" 
                        ? "Task accepted" 
                        : "Task rejected"}
                  </CardDescription>
                </div>
                <Badge variant={getBadgeVariant(assignment.status)}>
                  {assignment.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pb-4">
              {task && (
                <div className="space-y-2 text-sm">
                  {task.description && (
                    <p className="text-muted-foreground">{task.description}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {task.start_time && format(new Date(task.start_time), "PPp")}
                      {task.end_time && ` - ${format(new Date(task.end_time), "p")}`}
                    </span>
                  </div>
                  
                  {assignment.message && (
                    <div className="mt-4 p-3 bg-secondary/20 rounded-md text-sm">
                      <p className="font-medium">Message:</p>
                      <p className="text-muted-foreground">{assignment.message}</p>
                    </div>
                  )}
                  
                  {assignment.rejection_reason && (
                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/10 rounded-md text-sm">
                      <p className="font-medium">Rejection reason:</p>
                      <p className="text-muted-foreground">{assignment.rejection_reason}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            
            {isPending && showReceived && (
              <CardFooter className="flex-col items-stretch space-y-3">
                {showRejectionForm[assignment.id] ? (
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Reason for rejecting this task..."
                      value={rejectionReasons[assignment.id] || ""}
                      onChange={(e) => handleReasonChange(assignment.id, e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        onClick={() => toggleRejectionForm(assignment.id)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={() => handleReject(assignment)}
                      >
                        Confirm Rejection
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2 w-full">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => toggleRejectionForm(assignment.id)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button 
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => handleAccept(assignment)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Accept
                    </Button>
                  </div>
                )}
              </CardFooter>
            )}
          </Card>
        );
      })}
    </div>
  );
};

// Utility function for badge variants
const getBadgeVariant = (status: string) => {
  switch (status) {
    case 'pending': return 'outline';
    case 'accepted': return 'success';
    case 'rejected': return 'destructive';
    default: return 'secondary';
  }
};

// Utility function for class names
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

export default TaskAssignmentList;


import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Calendar, 
  Clock, 
  MoreHorizontal, 
  User,
  CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export interface TaskProps {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  priority: "low" | "medium" | "high";
  category: string;
  assignedTo?: string;
  completed?: boolean;
}

interface TaskCardProps {
  task: TaskProps;
  onUpdate?: (task: TaskProps) => void;
}

const priorityColors = {
  low: "bg-priority-low text-white",
  medium: "bg-priority-medium text-white",
  high: "bg-priority-high text-white",
};

const TaskCard = ({ task, onUpdate }: TaskCardProps) => {
  const [isCompleted, setIsCompleted] = useState(task.completed || false);
  const { toast } = useToast();

  const handleMarkComplete = () => {
    const updatedTask = { ...task, completed: !isCompleted };
    setIsCompleted(!isCompleted);
    if (onUpdate) {
      onUpdate(updatedTask);
    }
    toast({
      title: isCompleted ? "Task marked as incomplete" : "Task completed",
      description: `"${task.title}" has been updated.`,
    });
  };

  const handleAssignToMe = () => {
    toast({
      title: "Task assigned to you",
      description: `You have been assigned to "${task.title}".`,
    });
  };

  return (
    <Card className={cn(
      "madhubani-card madhubani-border overflow-hidden transition-all", 
      isCompleted && "opacity-60"
    )}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <div>
          <Badge className={priorityColors[task.priority]}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </Badge>
          <Badge variant="outline" className="ml-2">{task.category}</Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Task menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleMarkComplete}>
              {isCompleted ? "Mark as incomplete" : "Mark as complete"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleAssignToMe}>
              Assign to me
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit Task</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Delete Task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-2">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "rounded-full h-6 w-6 p-0 flex-shrink-0 mt-1",
              isCompleted ? "text-priority-low" : "text-muted-foreground"
            )}
            onClick={handleMarkComplete}
          >
            <CheckCircle className={cn("h-5 w-5", isCompleted && "fill-priority-low")} />
            <span className="sr-only">Complete</span>
          </Button>
          
          <div>
            <h3 className={cn("text-lg font-medium leading-tight", 
              isCompleted && "line-through decoration-1"
            )}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-1 pb-3 flex justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          <span>{format(task.dueDate, "MMM d")}</span>
        </div>
        {task.dueDate && (
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{format(task.dueDate, "h:mm a")}</span>
          </div>
        )}
        {task.assignedTo && (
          <div className="flex items-center gap-1">
            <User className="h-3.5 w-3.5" />
            <span>{task.assignedTo}</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default TaskCard;

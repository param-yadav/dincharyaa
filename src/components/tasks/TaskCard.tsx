
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
  CheckCircle,
  Pin,
  PinOff,
  Pencil,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Task } from "@/hooks/use-tasks";
import { DrawerDialog } from "./DrawerDialog";
import TaskForm from "./TaskForm";

interface TaskCardProps {
  task: Task;
  onUpdate?: (task: Task) => void;
  onDelete?: (id: string) => void;
  onToggleComplete?: (id: string, currentStatus: boolean) => void;
  onTogglePin?: (id: string, currentStatus: boolean) => void;
  onEdit?: (task: Task) => void;
}

const priorityColors: Record<string, string> = {
  low: "bg-priority-low text-white",
  medium: "bg-priority-medium text-white",
  high: "bg-priority-high text-white",
};

const TaskCard = ({ task, onUpdate, onDelete, onToggleComplete, onTogglePin, onEdit }: TaskCardProps) => {
  const [isCompleted, setIsCompleted] = useState(task.completed || false);
  const [isPinned, setIsPinned] = useState(task.is_pinned || false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { toast } = useToast();

  const handleMarkComplete = () => {
    setIsCompleted(!isCompleted);
    if (onToggleComplete) {
      onToggleComplete(task.id, isCompleted);
    }
  };

  const handleTogglePin = () => {
    setIsPinned(!isPinned);
    if (onTogglePin) {
      onTogglePin(task.id, isPinned);
    }
  };

  const handleEdit = () => {
    setIsEditOpen(true);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(task.id);
    }
  };

  const handleTaskUpdate = (updatedTask: Omit<Task, "id" | "user_id" | "created_at" | "updated_at">) => {
    if (onUpdate) {
      onUpdate({
        ...task,
        ...updatedTask
      });
    }
    setIsEditOpen(false);
  };

  const handleTaskCancel = () => {
    setIsEditOpen(false);
  };

  return (
    <>
      <Card className={cn(
        "madhubani-card madhubani-border overflow-hidden transition-all", 
        isCompleted && "opacity-60",
        isPinned && "border-amber-400 border-2"
      )}>
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
          <div>
            <Badge className={priorityColors[task.priority]}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
            <Badge variant="outline" className="ml-2">{task.category}</Badge>
            {isPinned && (
              <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700 border-amber-300">
                <Pin className="h-3 w-3 mr-1" /> Pinned
              </Badge>
            )}
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
              <DropdownMenuItem onClick={handleTogglePin}>
                {isPinned ? "Unpin task" : "Pin task"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleEdit}>
                <Pencil className="h-4 w-4 mr-2" /> Edit Task
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete Task
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
            <span>{format(new Date(task.start_time), "MMM d")}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{format(new Date(task.start_time), "h:mm a")}</span>
          </div>
          {task.assigned_to && (
            <div className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              <span>{task.assigned_to}</span>
            </div>
          )}
        </CardFooter>
      </Card>
      
      <DrawerDialog
        isOpen={isEditOpen}
        onClose={handleTaskCancel}
        title="Edit Task"
      >
        <TaskForm
          initialData={task}
          onSubmit={handleTaskUpdate}
          onCancel={handleTaskCancel}
        />
      </DrawerDialog>
    </>
  );
};

export default TaskCard;

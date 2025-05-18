import { useState, useEffect } from "react";
import { format, addMinutes, parse } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Task } from "@/hooks/use-tasks";
import { useMediaQuery } from "@/hooks/use-mobile";
import TaskAssignment from "./TaskAssignment";
import { useTaskAssignments } from "@/hooks/use-task-assignments";

export interface TaskFormProps {
  onTaskCreate?: (task: Omit<Task, "id" | "user_id" | "created_at" | "updated_at">) => Promise<any>;
  initialData?: Task | null;
  onSubmit?: (task: Omit<Task, "id" | "user_id" | "created_at" | "updated_at">) => Promise<void>;
  onCancel?: () => void;
  defaultDate?: Date;
}

const parseTimeString = (timeString: string): { hours: number; minutes: number } => {
  const [hours, minutes] = timeString.split(":").map(Number);
  return { hours, minutes };
};

const formatTimeForInput = (date: Date): string => {
  return format(date, "HH:mm");
};

const TaskForm = ({ onTaskCreate, initialData, onSubmit, onCancel, defaultDate }: TaskFormProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(defaultDate || new Date());
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [category, setCategory] = useState("Work");
  const [reminderMinutes, setReminderMinutes] = useState("15");
  const [assignees, setAssignees] = useState<string[]>([]);
  const [assignmentMessage, setAssignmentMessage] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);
  
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { assignTask } = useTaskAssignments();

  // Initialize form data if editing an existing task
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      
      if (initialData.start_time) {
        const startDateTime = new Date(initialData.start_time);
        setStartDate(startDateTime);
        setStartTime(formatTimeForInput(startDateTime));
      }
      
      if (initialData.end_time) {
        setEndTime(formatTimeForInput(new Date(initialData.end_time)));
      }
      
      setPriority(initialData.priority as "low" | "medium" | "high");
      setCategory(initialData.category || "Work");
      
      // Calculate reminder time from start_time and reminder_time
      if (initialData.reminder_time && initialData.start_time) {
        const startTime = new Date(initialData.start_time);
        const reminderTime = new Date(initialData.reminder_time);
        const diffMinutes = Math.round((startTime.getTime() - reminderTime.getTime()) / 60000);
        setReminderMinutes(diffMinutes.toString());
      }
    } else if (defaultDate) {
      // Use the defaultDate if provided and no initialData
      setStartDate(defaultDate);
    }
  }, [initialData, defaultDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !title) return;
    
    // Combine date and time for start_time
    const { hours: startHours, minutes: startMinutes } = parseTimeString(startTime);
    const startDateTime = new Date(startDate);
    startDateTime.setHours(startHours, startMinutes, 0);
    
    // Calculate end_time if provided
    let endDateTime = undefined;
    if (endTime) {
      const { hours: endHours, minutes: endMinutes } = parseTimeString(endTime);
      endDateTime = new Date(startDate);
      endDateTime.setHours(endHours, endMinutes, 0);
    }
    
    // Calculate reminder_time based on minutes before start
    let reminderDateTime = undefined;
    if (reminderMinutes) {
      reminderDateTime = new Date(startDateTime.getTime() - parseInt(reminderMinutes) * 60000);
    }
    
    const newTask: Omit<Task, "id" | "user_id" | "created_at" | "updated_at"> = {
      title,
      description: description || "",
      start_time: startDateTime.toISOString(),
      end_time: endDateTime ? endDateTime.toISOString() : undefined,
      priority: priority as "low" | "medium" | "high",
      category,
      is_pinned: initialData?.is_pinned || false,
      completed: initialData?.completed || false,
      reminder_time: reminderDateTime?.toISOString(),
      reminder_sent: false
    };
    
    // Handle task creation or update
    if (onTaskCreate) {
      const createdTask = await onTaskCreate(newTask);
      
      // If there are assignees and the task was created successfully, assign the task
      if (assignees.length > 0 && createdTask && isAssigning) {
        await assignTask({
          task: createdTask as Task,
          assignees,
          message: assignmentMessage
        });
      }
      
      setOpen(false);
    } else if (onSubmit) {
      await onSubmit(newTask);
      
      // If there are assignees and this is an existing task, assign the task
      if (assignees.length > 0 && initialData && isAssigning) {
        await assignTask({
          task: initialData,
          assignees,
          message: assignmentMessage
        });
      }
    }
    
    // Reset form
    setTitle("");
    setDescription("");
    setStartDate(new Date());
    setStartTime("09:00");
    setEndTime("");
    setPriority("medium");
    setCategory("Work");
    setReminderMinutes("15");
    setAssignees([]);
    setAssignmentMessage("");
    setIsAssigning(false);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      setOpen(false);
    }
  };

  const toggleAssigning = () => {
    setIsAssigning(!isAssigning);
  };

  const contentProps = {
    title: initialData ? "Edit Task" : "Add New Task",
    confirmText: initialData ? "Save Changes" : "Create Task",
  };
  
  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add details about this task..."
            className="min-h-24"
          />
        </div>
        
        <div className="grid gap-2">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="start-time">Start Time</Label>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="end-time">End Time (optional)</Label>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <Input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={(value) => setPriority(value as any)}>
              <SelectTrigger id="priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Work">Work</SelectItem>
                <SelectItem value="Personal">Personal</SelectItem>
                <SelectItem value="Health">Health</SelectItem>
                <SelectItem value="Family">Family</SelectItem>
                <SelectItem value="Home">Home</SelectItem>
                <SelectItem value="Schedule">Schedule</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="reminder">Remind Me</Label>
          <Select value={reminderMinutes} onValueChange={setReminderMinutes}>
            <SelectTrigger id="reminder">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 minutes before</SelectItem>
              <SelectItem value="10">10 minutes before</SelectItem>
              <SelectItem value="15">15 minutes before</SelectItem>
              <SelectItem value="30">30 minutes before</SelectItem>
              <SelectItem value="60">1 hour before</SelectItem>
              <SelectItem value="120">2 hours before</SelectItem>
              <SelectItem value="0">No reminder</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center pt-2">
          <Button type="button" variant="outline" onClick={toggleAssigning}>
            {isAssigning ? "Don't Assign" : "Assign to Team Members"}
          </Button>
        </div>
        
        {isAssigning && (
          <TaskAssignment
            task={initialData || undefined}
            onAssignees={setAssignees}
            onMessage={setAssignmentMessage}
          />
        )}
      </div>
      
      <DialogFooter className="pt-4">
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit">{contentProps.confirmText}</Button>
      </DialogFooter>
    </form>
  );

  // Only render the trigger button if this is being used as a standalone component
  if (onTaskCreate && !onSubmit) {
    if (isDesktop) {
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="default">Add Task</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{contentProps.title}</DialogTitle>
            </DialogHeader>
            {formContent}
          </DialogContent>
        </Dialog>
      );
    }

    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="default">Add Task</Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[85vh] overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>{contentProps.title}</DrawerTitle>
          </DrawerHeader>
          <div className="px-4">{formContent}</div>
          <DrawerFooter className="pt-2" />
        </DrawerContent>
      </Drawer>
    );
  }

  // Otherwise just render the form content for use in other components
  return formContent;
};

export default TaskForm;

import { useState, useEffect } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, parse, setHours, setMinutes } from "date-fns";
import { CalendarIcon, Plus, Pin, PinOff, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Task } from "@/hooks/use-tasks";
import { useAuth } from "@/hooks/use-auth";
import { Checkbox } from "@/components/ui/checkbox";

export interface TaskFormProps {
  onTaskCreate?: (task: Omit<Task, "id" | "user_id" | "created_at" | "updated_at">) => void;
  initialData?: Task | null;
  onSubmit?: (task: Omit<Task, "id" | "user_id" | "created_at" | "updated_at">) => void;
  onCancel?: () => void;
}

const parseTimeString = (timeString: string): { hours: number; minutes: number } => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return { hours, minutes };
};

const formatTimeForInput = (date: Date | null): string => {
  if (!date) return '';
  return format(date, "HH:mm");
};

const TaskForm = ({ onTaskCreate, initialData, onSubmit, onCancel }: TaskFormProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [category, setCategory] = useState("Work");
  const [assignedTo, setAssignedTo] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [reminderMinutes, setReminderMinutes] = useState<string>("15");
  
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || "");
      
      // Parse start time from initialData
      if (initialData.start_time) {
        const startDateTime = new Date(initialData.start_time);
        setStartDate(startDateTime);
        setStartTime(format(startDateTime, "HH:mm"));
      }
      
      // Parse end time from initialData
      if (initialData.end_time) {
        setEndTime(format(new Date(initialData.end_time), "HH:mm"));
      }
      
      setPriority(initialData.priority || "medium");
      setCategory(initialData.category || "Work");
      setAssignedTo(initialData.assigned_to || "");
      setIsPinned(initialData.is_pinned || false);
      setIsCompleted(initialData.completed || false);
      
      // Set reminder minutes if available
      if (initialData.start_time && initialData.reminder_time) {
        const startTime = new Date(initialData.start_time).getTime();
        const reminderTime = new Date(initialData.reminder_time).getTime();
        const diffMinutes = Math.round((startTime - reminderTime) / 60000);
        setReminderMinutes(diffMinutes.toString());
      }
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create tasks",
        variant: "destructive",
      });
      return;
    }
    
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your task",
        variant: "destructive",
      });
      return;
    }
    
    if (!startDate) {
      toast({
        title: "Start date required",
        description: "Please select a start date for your task",
        variant: "destructive",
      });
      return;
    }

    if (!startTime) {
      toast({
        title: "Start time required",
        description: "Please select a start time for your task",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Prepare start time
      const { hours: startHours, minutes: startMinutes } = parseTimeString(startTime);
      const startDateTime = setMinutes(setHours(startDate, startHours), startMinutes);
      
      // Prepare end time (if provided)
      let endDateTime = undefined;
      if (endTime) {
        const { hours: endHours, minutes: endMinutes } = parseTimeString(endTime);
        endDateTime = setMinutes(setHours(new Date(startDate), endHours), endMinutes);
        
        // Validate that end time is after start time
        if (endDateTime <= startDateTime) {
          toast({
            title: "Invalid time range",
            description: "End time must be after start time",
            variant: "destructive",
          });
          return;
        }
      }
      
      const newTask: Omit<Task, "id" | "user_id" | "created_at" | "updated_at"> = {
        title,
        description,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime?.toISOString(),
        priority,
        category,
        assigned_to: assignedTo,
        is_pinned: isPinned,
        completed: isCompleted,
        reminder_sent: false
      };
      
      if (onSubmit) {
        onSubmit(newTask);
      } else if (onTaskCreate) {
        onTaskCreate(newTask);
      }
      
      // Reset form if this is a new task creation
      if (!initialData) {
        setTitle("");
        setDescription("");
        setStartDate(new Date());
        setStartTime("09:00");
        setEndTime("");
        setPriority("medium");
        setCategory("Work");
        setAssignedTo("");
        setIsPinned(false);
        setIsCompleted(false);
        setReminderMinutes("15");
      }
      
      setOpen(false);
      
      if (onCancel && initialData) {
        onCancel();
      }
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        title: "Error creating task",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  // If this is being rendered inside a drawer (with onSubmit and onCancel)
  if (onSubmit) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 py-2">
          <div className="flex justify-between items-center">
            <div className="flex-1 grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-title" className="text-right">
                Title
              </Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
                placeholder="Enter task title"
                required
              />
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className={cn(isPinned ? "text-amber-500" : "text-muted-foreground")}
                onClick={() => setIsPinned(!isPinned)}
              >
                {isPinned ? <Pin className="h-4 w-4 fill-current" /> : <PinOff className="h-4 w-4" />}
                <span className="sr-only">{isPinned ? "Unpin task" : "Pin task"}</span>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-description" className="text-right">
              Description
            </Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="Enter task description"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-dueDate" className="text-right">
              Date
            </Label>
            <div className="col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-startTime" className="text-right">
              Start Time
            </Label>
            <Input
              id="edit-startTime"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-endTime" className="text-right">
              End Time
            </Label>
            <Input
              id="edit-endTime"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-reminder" className="text-right">
              Reminder
            </Label>
            <Select
              value={reminderMinutes}
              onValueChange={setReminderMinutes}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Set reminder" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 minutes before</SelectItem>
                <SelectItem value="15">15 minutes before</SelectItem>
                <SelectItem value="30">30 minutes before</SelectItem>
                <SelectItem value="60">1 hour before</SelectItem>
                <SelectItem value="120">2 hours before</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-priority" className="text-right">
              Priority
            </Label>
            <Select
              value={priority}
              onValueChange={(value) => setPriority(value as "low" | "medium" | "high")}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-category" className="text-right">
              Category
            </Label>
            <Select
              value={category}
              onValueChange={setCategory}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Work">Work</SelectItem>
                <SelectItem value="Personal">Personal</SelectItem>
                <SelectItem value="Home">Home</SelectItem>
                <SelectItem value="Errands">Errands</SelectItem>
                <SelectItem value="Health">Health</SelectItem>
                <SelectItem value="Breakfast">Breakfast</SelectItem>
                <SelectItem value="Lunch">Lunch</SelectItem>
                <SelectItem value="Dinner">Dinner</SelectItem>
                <SelectItem value="Exercise">Exercise</SelectItem>
                <SelectItem value="Study">Study</SelectItem>
                <SelectItem value="Meeting">Meeting</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-assignedTo" className="text-right">
              Assign To
            </Label>
            <Input
              id="edit-assignedTo"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="col-span-3"
              placeholder="Enter email address or name"
            />
          </div>
          
          {initialData && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-completed" className="text-right">
                Status
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Checkbox
                  id="edit-completed"
                  checked={isCompleted}
                  onCheckedChange={(checked) => 
                    setIsCompleted(checked === true)
                  }
                />
                <label
                  htmlFor="edit-completed"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-200"
                >
                  Mark as completed
                </label>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </form>
    );
  }

  // Original dialog-based form
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-amber-50 border-amber-200 dark:bg-dincharya-text/80 dark:border-dincharya-border">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-center text-xl dark:text-white">Create New Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            <div className="grid grid-cols-[100px_1fr] items-center gap-4">
              <Label htmlFor="title" className="text-right font-medium dark:text-white">
                Title
              </Label>
              <div className="flex gap-2 items-center">
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border-amber-300 bg-white dark:bg-dincharya-muted dark:border-dincharya-border dark:text-white"
                  placeholder="Enter task title"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={cn(isPinned ? "text-amber-500" : "text-muted-foreground")}
                  onClick={() => setIsPinned(!isPinned)}
                >
                  {isPinned ? <Pin className="h-4 w-4 fill-current" /> : <PinOff className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-[100px_1fr] items-start gap-4">
              <Label htmlFor="description" className="text-right font-medium pt-2 dark:text-white">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border-amber-300 bg-white dark:bg-dincharya-muted dark:border-dincharya-border dark:text-white"
                placeholder="Enter task description"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-[100px_1fr] items-center gap-4">
              <Label htmlFor="startDate" className="text-right font-medium dark:text-white">
                Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-amber-300 bg-white dark:bg-dincharya-muted dark:border-dincharya-border dark:text-white",
                      !startDate && "text-muted-foreground dark:text-gray-400"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white dark:bg-dincharya-text" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid grid-cols-[100px_1fr] items-center gap-4">
              <Label htmlFor="startTime" className="text-right font-medium dark:text-white">
                Start Time
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="border-amber-300 bg-white dark:bg-dincharya-muted dark:border-dincharya-border dark:text-white"
                  required
                />
                <Clock className="h-5 w-5 text-muted-foreground dark:text-gray-400" />
              </div>
            </div>
            
            <div className="grid grid-cols-[100px_1fr] items-center gap-4">
              <Label htmlFor="endTime" className="text-right font-medium dark:text-white">
                End Time
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="border-amber-300 bg-white dark:bg-dincharya-muted dark:border-dincharya-border dark:text-white"
                />
                <Clock className="h-5 w-5 text-muted-foreground dark:text-gray-400" />
              </div>
            </div>
            
            <div className="grid grid-cols-[100px_1fr] items-center gap-4">
              <Label htmlFor="reminder" className="text-right font-medium dark:text-white">
                Reminder
              </Label>
              <Select
                value={reminderMinutes}
                onValueChange={setReminderMinutes}
              >
                <SelectTrigger className="border-amber-300 bg-white dark:bg-dincharya-muted dark:border-dincharya-border dark:text-white">
                  <SelectValue placeholder="Set reminder" />
                </SelectTrigger>
                <SelectContent className="dark:bg-dincharya-text dark:border-dincharya-border">
                  <SelectItem value="5">5 minutes before</SelectItem>
                  <SelectItem value="15">15 minutes before</SelectItem>
                  <SelectItem value="30">30 minutes before</SelectItem>
                  <SelectItem value="60">1 hour before</SelectItem>
                  <SelectItem value="120">2 hours before</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-[100px_1fr] items-center gap-4">
              <Label htmlFor="priority" className="text-right font-medium dark:text-white">
                Priority
              </Label>
              <Select
                value={priority}
                onValueChange={(value) => setPriority(value as "low" | "medium" | "high")}
              >
                <SelectTrigger className="border-amber-300 bg-white dark:bg-dincharya-muted dark:border-dincharya-border dark:text-white">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="dark:bg-dincharya-text dark:border-dincharya-border">
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-[100px_1fr] items-center gap-4">
              <Label htmlFor="category" className="text-right font-medium dark:text-white">
                Category
              </Label>
              <Select
                value={category}
                onValueChange={setCategory}
              >
                <SelectTrigger className="border-amber-300 bg-white dark:bg-dincharya-muted dark:border-dincharya-border dark:text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="dark:bg-dincharya-text dark:border-dincharya-border">
                  <SelectItem value="Work">Work</SelectItem>
                  <SelectItem value="Personal">Personal</SelectItem>
                  <SelectItem value="Home">Home</SelectItem>
                  <SelectItem value="Errands">Errands</SelectItem>
                  <SelectItem value="Health">Health</SelectItem>
                  <SelectItem value="Breakfast">Breakfast</SelectItem>
                  <SelectItem value="Lunch">Lunch</SelectItem>
                  <SelectItem value="Dinner">Dinner</SelectItem>
                  <SelectItem value="Exercise">Exercise</SelectItem>
                  <SelectItem value="Study">Study</SelectItem>
                  <SelectItem value="Meeting">Meeting</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-[100px_1fr] items-center gap-4">
              <Label htmlFor="assignedTo" className="text-right font-medium dark:text-white">
                Assign To
              </Label>
              <Input
                id="assignedTo"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="border-amber-300 bg-white dark:bg-dincharya-muted dark:border-dincharya-border dark:text-white"
                placeholder="Enter email address or name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button className="bg-amber-600 hover:bg-amber-700 w-full" type="submit">
              Create Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;

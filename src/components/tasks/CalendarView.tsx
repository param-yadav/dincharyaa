
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, isSameDay } from "date-fns";
import { TaskProps } from "./TaskCard";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from "lucide-react";
import TaskForm from "./TaskForm";
import TaskCard from "./TaskCard";

interface CalendarViewProps {
  tasks: TaskProps[];
  onTaskCreate?: (task: TaskProps) => void;
  onTaskUpdate?: (task: TaskProps) => void;
}

const priorityColors = {
  low: "bg-priority-low",
  medium: "bg-priority-medium",
  high: "bg-priority-high",
};

const CalendarView = ({
  tasks = [],
  onTaskCreate,
  onTaskUpdate,
}: CalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Find tasks for the selected date
  const tasksForSelectedDate = tasks.filter((task) =>
    isSameDay(task.dueDate, selectedDate)
  );

  // Function to display task indicators on calendar days
  const getDayClassNames = (day: Date | undefined) => {
    if (!day) return "";
    
    const tasksOnDay = tasks.filter(task => isSameDay(task.dueDate, day));
    
    if (tasksOnDay.length === 0) return "";
    
    // Check for high priority tasks first
    if (tasksOnDay.some(task => task.priority === "high")) {
      return "bg-priority-high/10 font-medium";
    } 
    // Then medium priority
    else if (tasksOnDay.some(task => task.priority === "medium")) {
      return "bg-priority-medium/10 font-medium";
    }
    // Then low priority
    else if (tasksOnDay.some(task => task.priority === "low")) {
      return "bg-priority-low/10 font-medium";
    }
    
    return "";
  };

  const renderTaskCountIndicator = (day: Date) => {
    const tasksOnDay = tasks.filter(task => isSameDay(task.dueDate, day));
    if (tasksOnDay.length === 0) return null;
    
    // Group tasks by priority
    const highPriorityCount = tasksOnDay.filter(t => t.priority === "high").length;
    const mediumPriorityCount = tasksOnDay.filter(t => t.priority === "medium").length;
    const lowPriorityCount = tasksOnDay.filter(t => t.priority === "low").length;
    
    return (
      <div className="flex gap-1 justify-center mt-1">
        {highPriorityCount > 0 && (
          <div className={cn("h-1.5 w-1.5 rounded-full", priorityColors.high)}></div>
        )}
        {mediumPriorityCount > 0 && (
          <div className={cn("h-1.5 w-1.5 rounded-full", priorityColors.medium)}></div>
        )}
        {lowPriorityCount > 0 && (
          <div className={cn("h-1.5 w-1.5 rounded-full", priorityColors.low)}></div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Calendar</h2>
          <TaskForm onTaskCreate={onTaskCreate} />
        </div>
      </div>
      
      <div className="grid md:grid-cols-[1fr_350px] h-[calc(100%-65px)] overflow-hidden">
        <div className="p-4 flex flex-col h-full overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <Button variant="ghost" onClick={() => setSelectedDate(new Date())}>
              Today
            </Button>
            <div className="flex items-center">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="text-lg font-medium mx-4">
                {format(selectedDate, "MMMM yyyy")}
              </h3>
              <Button variant="ghost" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto pb-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border mx-auto p-3 pointer-events-auto"
              modifiersClassNames={{
                selected: "bg-primary !text-primary-foreground font-medium",
              }}
              components={{
                Day: ({ date, ...props }) => (
                  <Button
                    variant="ghost"
                    {...props}
                    className={cn(
                      props.className,
                      getDayClassNames(date),
                      "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
                    )}
                  >
                    {date ? (
                      <div className="flex flex-col items-center">
                        <span>{format(date, "d")}</span>
                        {renderTaskCountIndicator(date)}
                      </div>
                    ) : null}
                  </Button>
                ),
              }}
            />
          </div>
        </div>
        
        <div className="border-l h-full flex flex-col">
          <div className="p-4 border-b bg-muted/30">
            <h3 className="text-lg font-medium">
              Tasks for {format(selectedDate, "EEEE, MMMM d")}
            </h3>
          </div>
          
          <div className="flex-1 overflow-auto p-4">
            {tasksForSelectedDate.length > 0 ? (
              <div className="space-y-3">
                {tasksForSelectedDate.map((task) => (
                  <TaskCard key={task.id} task={task} onUpdate={onTaskUpdate} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <CalendarIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <h4 className="text-lg font-medium mb-1">No tasks scheduled</h4>
                <p className="text-muted-foreground text-sm mb-4">
                  There are no tasks scheduled for this date.
                </p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Plus className="h-3.5 w-3.5" /> Add Task
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="text-sm text-center font-medium pb-2">Quick Add Task</div>
                    <div className="space-y-2">
                      <input
                        className="w-full p-2 border rounded-md text-sm"
                        placeholder="Task title"
                      />
                      <div className="flex gap-2">
                        <Button className="w-full text-xs h-8" size="sm">Add Task</Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;

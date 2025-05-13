
import { useEffect, useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { TaskProps } from "./TaskCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DrawerDialog } from "./DrawerDialog";
import TaskForm from "./TaskForm";

interface CalendarViewProps {
  tasks: TaskProps[];
  onTaskCreate: (task: TaskProps) => void;
  onTaskUpdate: (task: TaskProps) => void;
}

const CalendarView = ({ tasks, onTaskCreate, onTaskUpdate }: CalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [displayMonth, setDisplayMonth] = useState<Date>(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskProps | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");
  
  const tasksForSelectedDate = tasks.filter(
    (task) => task.dueDate && isSameDay(new Date(task.dueDate), selectedDate)
  );

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleAddTask = () => {
    setMode("create");
    setSelectedTask(null);
    setIsFormOpen(true);
  };

  const handleEditTask = (task: TaskProps) => {
    setMode("edit");
    setSelectedTask(task);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (task: TaskProps) => {
    if (mode === "create") {
      onTaskCreate({
        ...task,
        id: `task-${Date.now()}`,
        dueDate: selectedDate
      });
    } else {
      onTaskUpdate(task);
    }
    
    setIsFormOpen(false);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
      {/* Calendar Section */}
      <div className="md:col-span-1 bg-white dark:bg-dincharya-text/80 rounded-lg p-4 shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-dincharya-text dark:text-white">
            {format(displayMonth, "MMMM yyyy")}
          </h3>
        </div>
        
        <div className="flex justify-center p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            onMonthChange={setDisplayMonth}
            className="p-0 pointer-events-auto"
          />
        </div>
      </div>
      
      {/* Tasks for Selected Day Section */}
      <div className="md:col-span-2 bg-white dark:bg-dincharya-text/80 rounded-lg p-4 shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-dincharya-text dark:text-white">
            Tasks for {format(selectedDate, "MMMM d, yyyy")}
          </h3>
          <Button 
            size="sm" 
            onClick={handleAddTask}
            className="bg-dincharya-primary hover:bg-dincharya-primary/90"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Task
          </Button>
        </div>
        
        {tasksForSelectedDate.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-dincharya-text/50 dark:text-white/50">
            <p>No tasks scheduled for this day</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={handleAddTask}
            >
              Add a task
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {tasksForSelectedDate.map((task) => (
              <div 
                key={task.id} 
                className="p-3 bg-dincharya-background/30 dark:bg-dincharya-muted/10 rounded-lg border border-dincharya-muted/20 hover:border-dincharya-primary cursor-pointer transition-all"
                onClick={() => handleEditTask(task)}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-dincharya-text dark:text-white">{task.title}</h4>
                  <div className={`px-2 py-0.5 rounded-full text-xs ${
                    task.priority === "high" 
                      ? "bg-priority-high/20 text-priority-high" 
                      : task.priority === "medium"
                        ? "bg-priority-medium/20 text-priority-medium"
                        : "bg-priority-low/20 text-priority-low"
                  }`}>
                    {task.priority}
                  </div>
                </div>
                {task.description && (
                  <p className="text-sm text-dincharya-text/70 dark:text-white/70 mt-2">{task.description}</p>
                )}
                {task.dueDate && (
                  <p className="text-xs text-dincharya-text/60 dark:text-white/60 mt-2">
                    {format(new Date(task.dueDate), "h:mm a")}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Task Form Drawer Dialog */}
      <DrawerDialog
        isOpen={isFormOpen}
        onClose={handleFormCancel}
        title={mode === "create" ? "Add New Task" : "Edit Task"}
      >
        <TaskForm
          initialData={selectedTask}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      </DrawerDialog>
    </div>
  );
};

export default CalendarView;

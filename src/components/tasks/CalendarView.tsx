
import { useEffect, useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DrawerDialog } from "./DrawerDialog";
import TaskForm from "./TaskForm";
import { Task } from "@/hooks/use-tasks";

interface CalendarViewProps {
  tasks: Task[];
  onTaskCreate: (task: Omit<Task, "id" | "user_id" | "created_at" | "updated_at">) => Promise<void>;
  onTaskUpdate: (task: Task) => Promise<void>;
}

const CalendarView = ({ tasks, onTaskCreate, onTaskUpdate }: CalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [displayMonth, setDisplayMonth] = useState<Date>(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");
  
  const tasksForSelectedDate = tasks.filter(
    (task) => task.start_time && isSameDay(new Date(task.start_time), selectedDate)
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

  const handleEditTask = (task: Task) => {
    setMode("edit");
    setSelectedTask(task);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (task: Omit<Task, "id" | "user_id" | "created_at" | "updated_at">) => {
    try {
      if (mode === "create") {
        await onTaskCreate(task);
      } else if (selectedTask) {
        await onTaskUpdate({
          ...selectedTask,
          ...task
        });
      }
      
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error handling task form submit:", error);
    }
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
  };

  return (
    <div className="p-4 bg-gradient-to-br from-dincharya-background to-dincharya-muted/20 dark:from-dincharya-text dark:to-dincharya-muted/10 min-h-[600px]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* Calendar Section */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-dincharya-text/90 rounded-lg p-4 shadow-md border border-dincharya-border/20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-dincharya-text dark:text-white">
                {format(displayMonth, "MMMM yyyy")}
              </h3>
            </div>
            
            <div className="w-full overflow-hidden">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                onMonthChange={setDisplayMonth}
                className="w-full border-0 p-0"
              />
            </div>
          </div>
        </div>
        
        {/* Tasks for Selected Day Section */}
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-dincharya-text/90 rounded-lg p-6 shadow-md border border-dincharya-border/20">
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
                <p className="mb-4">No tasks scheduled for this day</p>
                <Button 
                  variant="outline" 
                  className="border-dincharya-border/30 text-dincharya-text dark:text-white"
                  onClick={handleAddTask}
                >
                  Add a task
                </Button>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
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
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" 
                          : task.priority === "medium"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                            : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      }`}>
                        {task.priority}
                      </div>
                    </div>
                    {task.description && (
                      <p className="text-sm text-dincharya-text/70 dark:text-white/70 mt-2">{task.description}</p>
                    )}
                    {task.start_time && (
                      <p className="text-xs text-dincharya-text/60 dark:text-white/60 mt-2">
                        {format(new Date(task.start_time), "h:mm a")}
                        {task.end_time && ` - ${format(new Date(task.end_time), "h:mm a")}`}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
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
          defaultDate={selectedDate}
        />
      </DrawerDialog>
    </div>
  );
};

export default CalendarView;

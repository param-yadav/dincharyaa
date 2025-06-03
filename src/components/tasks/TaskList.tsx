
import { useState } from "react";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal, Calendar } from "lucide-react";
import { useTasks, Task } from "@/hooks/use-tasks";
import LoadingSpinner from "@/components/ui/loading-spinner";

const TaskList = () => {
  const { tasks, loading, createTask, updateTask, deleteTask, togglePinTask, toggleCompleteTask } = useTasks();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("start_time");

  // Filter tasks based on search query and filters
  const filteredTasks = tasks.filter((task) => {
    // Search filter
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Priority filter
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
    
    // Category filter
    const matchesCategory = filterCategory === "all" || task.category === filterCategory;
    
    return matchesSearch && matchesPriority && matchesCategory;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case "start_time":
        return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
      case "priority":
        const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      case "title":
        return a.title.localeCompare(b.title);
      case "pinned":
        return (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0);
      default:
        return 0;
    }
  });

  // Handle task create
  const handleTaskCreate = async (newTask: Omit<Task, "id" | "user_id" | "created_at" | "updated_at">) => {
    await createTask(newTask);
  };

  // Handle task update
  const handleTaskUpdate = async (updatedTask: Task) => {
    const { id, ...rest } = updatedTask;
    await updateTask(id, rest);
  };

  // Handle task delete
  const handleTaskDelete = async (id: string) => {
    await deleteTask(id);
  };

  // Handle toggle complete
  const handleToggleComplete = async (id: string, currentStatus: boolean) => {
    await toggleCompleteTask(id, currentStatus);
  };

  // Handle toggle pin
  const handleTogglePin = async (id: string, currentStatus: boolean) => {
    await togglePinTask(id, currentStatus);
  };

  // Extract all unique categories from tasks
  const categories = Array.from(new Set(tasks.map(task => task.category)));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-12">
        <LoadingSpinner size="lg" className="text-dincharya-primary mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Loading your tasks...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-dincharya-text/90">
      <div className="p-6 border-b border-dincharya-border/20">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Search tasks..."
                className="pl-9 bg-white dark:bg-dincharya-muted border-dincharya-border/30 text-dincharya-text dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <TaskForm onTaskCreate={handleTaskCreate} />
          </div>
          
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <SlidersHorizontal className="h-4 w-4" /> Filters:
            </span>
            
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="h-8 w-[120px] bg-white dark:bg-dincharya-muted border-dincharya-border/30">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="h-8 w-[140px] bg-white dark:bg-dincharya-muted border-dincharya-border/30">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-8 w-[120px] bg-white dark:bg-dincharya-muted border-dincharya-border/30">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="start_time">Start Time</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="pinned">Pinned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-6 overflow-auto">
        {sortedTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedTasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onUpdate={handleTaskUpdate}
                onDelete={handleTaskDelete}
                onToggleComplete={handleToggleComplete}
                onTogglePin={handleTogglePin}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            {tasks.length > 0 ? (
              <div>
                <div className="rounded-full bg-dincharya-muted/20 p-6 mb-4">
                  <Search className="h-10 w-10 text-gray-500 dark:text-gray-400" />
                </div>
                <h3 className="text-2xl font-medium mb-1 text-dincharya-text dark:text-white">No tasks found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Try adjusting your filters or search query
                </p>
              </div>
            ) : (
              <div>
                <div className="rounded-full bg-dincharya-muted/20 p-6 mb-4">
                  <Calendar className="h-10 w-10 text-gray-500 dark:text-gray-400" />
                </div>
                <h3 className="text-2xl font-medium mb-1 text-dincharya-text dark:text-white">No tasks yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Get started by adding your first task
                </p>
                <TaskForm onTaskCreate={handleTaskCreate} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;

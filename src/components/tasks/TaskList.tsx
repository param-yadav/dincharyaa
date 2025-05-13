
import { useState } from "react";
import TaskCard, { TaskProps } from "./TaskCard";
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
import { Search, SlidersHorizontal } from "lucide-react";

// Sample tasks data
const initialTasks: TaskProps[] = [
  {
    id: "task1",
    title: "Complete project proposal",
    description: "Finalize the Q3 marketing strategy proposal for client review",
    dueDate: new Date(2023, 5, 15, 14, 0), // June 15, 2023, 2:00 PM
    priority: "high",
    category: "Work",
    assignedTo: "Me",
  },
  {
    id: "task2",
    title: "Weekly team meeting",
    description: "Discuss project progress and address any blockers",
    dueDate: new Date(2023, 5, 10, 10, 0), // June 10, 2023, 10:00 AM
    priority: "medium",
    category: "Work",
    assignedTo: "Sarah",
  },
  {
    id: "task3",
    title: "Research new tools",
    description: "Evaluate project management tools for team efficiency",
    dueDate: new Date(2023, 5, 20, 17, 0), // June 20, 2023, 5:00 PM
    priority: "low",
    category: "Work",
  },
  {
    id: "task4",
    title: "Doctor's appointment",
    description: "Annual checkup at City Health Clinic",
    dueDate: new Date(2023, 5, 12, 9, 30), // June 12, 2023, 9:30 AM
    priority: "medium",
    category: "Health",
    assignedTo: "Me",
  },
  {
    id: "task5",
    title: "Grocery shopping",
    description: "Pick up items for dinner party",
    dueDate: new Date(2023, 5, 8, 18, 0), // June 8, 2023, 6:00 PM
    priority: "low",
    category: "Errands",
  },
  {
    id: "task6",
    title: "Update website content",
    description: "Refresh homepage and add new product descriptions",
    dueDate: new Date(2023, 5, 18, 12, 0), // June 18, 2023, 12:00 PM
    priority: "high",
    category: "Work",
    assignedTo: "Michael",
  },
];

const TaskList = () => {
  const [tasks, setTasks] = useState<TaskProps[]>(initialTasks);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("dueDate");

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
      case "dueDate":
        return a.dueDate.getTime() - b.dueDate.getTime();
      case "priority":
        const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const handleTaskCreate = (newTask: TaskProps) => {
    setTasks([...tasks, newTask]);
  };

  const handleTaskUpdate = (updatedTask: TaskProps) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  // Extract all unique categories from tasks
  const categories = Array.from(new Set(tasks.map(task => task.category)));

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <TaskForm onTaskCreate={handleTaskCreate} />
        </div>
        
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="flex items-center gap-1 text-muted-foreground">
            <SlidersHorizontal className="h-4 w-4" /> Filters:
          </span>
          
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="h-8 w-[120px]">
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
            <SelectTrigger className="h-8 w-[140px]">
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
            <SelectTrigger className="h-8 w-[120px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dueDate">Due Date</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-auto">
        {sortedTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedTasks.map((task) => (
              <TaskCard key={task.id} task={task} onUpdate={handleTaskUpdate} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Search className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-medium mb-1">No tasks found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || filterPriority !== "all" || filterCategory !== "all"
                ? "Try adjusting your filters or search query"
                : "Get started by adding your first task"}
            </p>
            <TaskForm onTaskCreate={handleTaskCreate} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;


import { useState } from "react";
import TaskList from "@/components/tasks/TaskList";
import CalendarView from "@/components/tasks/CalendarView";
import { TaskProps } from "@/components/tasks/TaskCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, List } from "lucide-react";

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

const TasksPage = () => {
  const [tasks, setTasks] = useState<TaskProps[]>(initialTasks);
  const [activeView, setActiveView] = useState("list");
  
  const handleTaskCreate = (newTask: TaskProps) => {
    setTasks([...tasks, newTask]);
  };
  
  const handleTaskUpdate = (updatedTask: TaskProps) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-dincharya-text mb-6">Task Management</h1>
      
      <div className="bg-white dark:bg-dincharya-text/90 rounded-lg shadow-md mb-6 overflow-hidden">
        <div className="border-b border-dincharya-muted/20 p-4">
          <Tabs value={activeView} onValueChange={setActiveView} className="w-[300px]">
            <TabsList>
              <TabsTrigger value="list" className="flex gap-2 items-center">
                <List className="h-4 w-4" />
                <span>List</span>
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex gap-2 items-center">
                <Calendar className="h-4 w-4" />
                <span>Calendar</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="min-h-[600px]">
          <TabsContent value="list" className="m-0 p-0">
            <TaskList />
          </TabsContent>
          <TabsContent value="calendar" className="m-0 p-0 h-full">
            <CalendarView
              tasks={tasks}
              onTaskCreate={handleTaskCreate}
              onTaskUpdate={handleTaskUpdate}
            />
          </TabsContent>
        </div>
      </div>
    </div>
  );
};

export default TasksPage;

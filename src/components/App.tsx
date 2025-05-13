
import { useState } from "react";
import MainLayout from "./layout/MainLayout";
import TaskList from "./tasks/TaskList";
import CalendarView from "./tasks/CalendarView";
import { TaskProps } from "./tasks/TaskCard";
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

const App = () => {
  const [tasks, setTasks] = useState<TaskProps[]>(initialTasks);
  const [activeView, setActiveView] = useState("list");
  
  const handleTaskCreate = (newTask: TaskProps) => {
    setTasks([...tasks, newTask]);
  };
  
  const handleTaskUpdate = (updatedTask: TaskProps) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  return (
    <MainLayout>
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* View Switcher */}
        <div className="border-b">
          <div className="container py-2">
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
        </div>
        
        {/* Views Content */}
        <div className="flex-1 overflow-hidden">
          {activeView === "list" && <TaskList />}
          {activeView === "calendar" && (
            <CalendarView
              tasks={tasks}
              onTaskCreate={handleTaskCreate}
              onTaskUpdate={handleTaskUpdate}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default App;

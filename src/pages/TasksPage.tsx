
import { useState } from "react";
import TaskList from "@/components/tasks/TaskList";
import CalendarView from "@/components/tasks/CalendarView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, List } from "lucide-react";
import { useTasks } from "@/hooks/use-tasks";

const TasksPage = () => {
  const { tasks, createTask, updateTask } = useTasks();
  const [activeView, setActiveView] = useState("list");
  
  const handleTaskCreate = async (newTask: any) => {
    // Create the task and ignore the return value to match Promise<void>
    await createTask(newTask);
    return;
  };
  
  const handleTaskUpdate = async (updatedTask: any) => {
    const { id, ...rest } = updatedTask;
    // Update the task and ignore the return value to match Promise<void>
    await updateTask(id, rest);
    return;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-dincharya-text dark:text-white mb-6">Task Management</h1>
      
      <div className="bg-white dark:bg-dincharya-text/90 rounded-lg shadow-md mb-6 overflow-hidden">
        <Tabs defaultValue={activeView} onValueChange={setActiveView}>
          <div className="border-b border-dincharya-muted/20 p-4">
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
        </Tabs>
      </div>
    </div>
  );
};

export default TasksPage;

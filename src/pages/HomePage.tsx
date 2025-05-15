
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CheckSquare, Clock, Pin, ListTodo, ArrowRight, BellRing } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import { useTasks, Task } from "@/hooks/use-tasks";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import TaskForm from "@/components/tasks/TaskForm";
import { Badge } from "@/components/ui/badge";

const HomePage = () => {
  const { user } = useAuth();
  const { tasks, toggleCompleteTask, togglePinTask } = useTasks();
  const [notifications, setNotifications] = useState<any[]>([]);
  const navigate = useNavigate();
  
  // Get today's tasks
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayTasks = tasks.filter(task => {
    const taskDate = new Date(task.start_time);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() === today.getTime();
  });
  
  // Get pinned tasks
  const pinnedTasks = tasks.filter(task => task.is_pinned);
  
  // Get upcoming tasks (next 7 days)
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const upcomingTasks = tasks.filter(task => {
    const taskDate = new Date(task.start_time);
    return taskDate > today && taskDate <= nextWeek;
  }).slice(0, 5); // Show only 5 upcoming tasks
  
  // Group tasks by category
  const tasksByCategory: Record<string, Task[]> = {};
  tasks.forEach(task => {
    if (!tasksByCategory[task.category]) {
      tasksByCategory[task.category] = [];
    }
    tasksByCategory[task.category].push(task);
  });
  
  // Get tasks by completion status
  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);

  useEffect(() => {
    // Load notifications
    const loadNotifications = () => {
      if (!user) return;
      
      // In a real app, you would fetch notifications from your backend
      // For demo purposes, we'll use localStorage
      const savedNotifications = localStorage.getItem(`notifications_${user.id}`);
      if (savedNotifications) {
        try {
          setNotifications(JSON.parse(savedNotifications));
        } catch (e) {
          console.error("Error parsing notifications:", e);
        }
      }
    };
    
    loadNotifications();
  }, [user]);

  const handleToggleComplete = async (id: string, currentStatus: boolean) => {
    await toggleCompleteTask(id, currentStatus);
  };

  const handleTogglePin = async (id: string, currentStatus: boolean) => {
    await togglePinTask(id, currentStatus);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600 dark:text-red-400";
      case "medium": return "text-amber-600 dark:text-amber-400";
      case "low": return "text-green-600 dark:text-green-400";
      default: return "text-amber-600 dark:text-amber-400";
    }
  };

  const getCategoryColor = (category: string) => {
    const categoryColors: Record<string, string> = {
      "Work": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      "Personal": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      "Home": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      "Errands": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      "Health": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      "Breakfast": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
      "Lunch": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
      "Dinner": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
      "Exercise": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      "Study": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
      "Meeting": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    };
    
    return categoryColors[category] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  };
  
  const renderTaskItem = (task: Task) => {
    return (
      <div 
        key={task.id}
        className="flex items-center p-3 bg-white dark:bg-dincharya-text/90 rounded-lg shadow-sm border border-gray-100 dark:border-dincharya-border mb-2"
      >
        <div className="flex-shrink-0 mr-3">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => handleToggleComplete(task.id, task.completed)}
            className="h-5 w-5 rounded-md border-2 border-amber-300 text-amber-600 focus:ring-amber-600 dark:border-amber-700 dark:bg-dincharya-muted"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className={cn(
            "text-sm font-medium",
            task.completed ? "line-through text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-gray-100"
          )}>
            {task.title}
          </p>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
            <Clock className="h-3 w-3 mr-1" />
            {format(new Date(task.start_time), "h:mm a")}
            {task.end_time && ` - ${format(new Date(task.end_time), "h:mm a")}`}
          </div>
        </div>
        
        <div className="flex items-center ml-2 space-x-1">
          <Badge className={getCategoryColor(task.category)}>
            {task.category}
          </Badge>
          <button 
            onClick={() => handleTogglePin(task.id, task.is_pinned)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <Pin className={cn(
              "h-4 w-4",
              task.is_pinned ? "text-amber-500 fill-amber-500" : "text-gray-400"
            )} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-dincharya-text dark:text-white">
          {user ? `Welcome, ${user.email?.split('@')[0]}` : 'Welcome to Dincharya'}
        </h1>
        <TaskForm />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-md bg-white dark:bg-dincharya-text/90">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl dark:text-white flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-amber-600" />
                Today's Schedule
              </CardTitle>
              <CardDescription className="dark:text-gray-300">
                {format(today, "EEEE, MMMM d, yyyy")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {todayTasks.length > 0 ? (
                <div className="space-y-2">
                  {todayTasks.map(renderTaskItem)}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">No tasks scheduled for today</p>
                  <TaskForm />
                </div>
              )}
            </CardContent>
          </Card>
          
          <Tabs defaultValue="categories">
            <TabsList className="mb-4">
              <TabsTrigger value="categories">By Category</TabsTrigger>
              <TabsTrigger value="status">By Status</TabsTrigger>
            </TabsList>
            
            <TabsContent value="categories">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(tasksByCategory).map(([category, categoryTasks]) => (
                  <Card key={category} className="border-0 shadow-md bg-white dark:bg-dincharya-text/90">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg dark:text-white flex items-center">
                        <Badge className={getCategoryColor(category)} variant="outline">
                          {category}
                        </Badge>
                        <span className="ml-2">{categoryTasks.length} tasks</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="max-h-40 overflow-y-auto space-y-2">
                        {categoryTasks.slice(0, 3).map(renderTaskItem)}
                        {categoryTasks.length > 3 && (
                          <Button 
                            variant="ghost" 
                            className="w-full text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-900/30"
                            onClick={() => navigate('/tasks')}
                          >
                            View {categoryTasks.length - 3} more <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="status">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-0 shadow-md bg-white dark:bg-dincharya-text/90">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg dark:text-white flex items-center">
                      <ListTodo className="h-5 w-5 mr-2 text-amber-600" />
                      Pending ({pendingTasks.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {pendingTasks.slice(0, 3).map(renderTaskItem)}
                      {pendingTasks.length > 3 && (
                        <Button 
                          variant="ghost" 
                          className="w-full text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-900/30"
                          onClick={() => navigate('/tasks')}
                        >
                          View {pendingTasks.length - 3} more <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-md bg-white dark:bg-dincharya-text/90">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg dark:text-white flex items-center">
                      <CheckSquare className="h-5 w-5 mr-2 text-green-600" />
                      Completed ({completedTasks.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {completedTasks.slice(0, 3).map(renderTaskItem)}
                      {completedTasks.length > 3 && (
                        <Button 
                          variant="ghost" 
                          className="w-full text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-900/30"
                          onClick={() => navigate('/tasks')}
                        >
                          View {completedTasks.length - 3} more <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-0 shadow-md bg-white dark:bg-dincharya-text/90">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg dark:text-white flex items-center">
                <Pin className="h-5 w-5 mr-2 text-amber-600 fill-amber-600" />
                Pinned Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pinnedTasks.length > 0 ? (
                <div className="space-y-2">
                  {pinnedTasks.map(renderTaskItem)}
                </div>
              ) : (
                <p className="text-center py-4 text-gray-500 dark:text-gray-400">
                  No pinned tasks yet
                </p>
              )}
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md bg-white dark:bg-dincharya-text/90">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg dark:text-white flex items-center">
                <Clock className="h-5 w-5 mr-2 text-amber-600" />
                Upcoming
              </CardTitle>
              <CardDescription className="dark:text-gray-300">Next 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingTasks.length > 0 ? (
                <div className="space-y-2">
                  {upcomingTasks.map(renderTaskItem)}
                  {tasks.length > upcomingTasks.length && (
                    <Button 
                      variant="ghost" 
                      className="w-full text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-900/30"
                      onClick={() => navigate('/tasks')}
                    >
                      View all tasks <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  )}
                </div>
              ) : (
                <p className="text-center py-4 text-gray-500 dark:text-gray-400">
                  No upcoming tasks
                </p>
              )}
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md bg-white dark:bg-dincharya-text/90">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg dark:text-white flex items-center">
                <BellRing className="h-5 w-5 mr-2 text-amber-600" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {notifications.length > 0 ? (
                <div className="space-y-2">
                  {notifications.slice(0, 5).map((notification, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 dark:bg-dincharya-muted/20 rounded-lg">
                      <p className="font-medium text-sm dark:text-gray-200">{notification.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{notification.message}</p>
                    </div>
                  ))}
                  {notifications.length > 5 && (
                    <Button 
                      variant="ghost" 
                      className="w-full text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-900/30"
                      onClick={() => navigate('/notifications')}
                    >
                      View all notifications <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  )}
                </div>
              ) : (
                <p className="text-center py-4 text-gray-500 dark:text-gray-400">
                  No notifications
                </p>
              )}
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md bg-gradient-to-br from-amber-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">Quick Access</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  className="bg-white/20 text-white border-white/40 hover:bg-white/30 backdrop-blur-sm"
                  onClick={() => navigate('/tasks')}
                >
                  All Tasks
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-white/20 text-white border-white/40 hover:bg-white/30 backdrop-blur-sm"
                  onClick={() => navigate('/scheduler')}
                >
                  Scheduler
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-white/20 text-white border-white/40 hover:bg-white/30 backdrop-blur-sm"
                  onClick={() => navigate('/timer')}
                >
                  Timer
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-white/20 text-white border-white/40 hover:bg-white/30 backdrop-blur-sm"
                  onClick={() => navigate('/notes')}
                >
                  Notes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

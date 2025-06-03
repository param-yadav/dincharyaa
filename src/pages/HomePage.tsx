
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, CheckSquare, Clock, Pin, ArrowRight, Plus, BarChart3 } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import { useTasks, Task } from "@/hooks/use-tasks";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import TaskForm from "@/components/tasks/TaskForm";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const HomePage = () => {
  const { user } = useAuth();
  const { tasks, toggleCompleteTask, togglePinTask, loading } = useTasks();
  const navigate = useNavigate();
  
  // Get today's tasks
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayTasks = tasks.filter(task => {
    const taskDate = new Date(task.start_time);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() === today.getTime();
  }).slice(0, 5); // Limit to 5 tasks
  
  // Get pinned tasks
  const pinnedTasks = tasks.filter(task => task.is_pinned).slice(0, 3);
  
  // Get upcoming tasks (next 7 days)
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const upcomingTasks = tasks.filter(task => {
    const taskDate = new Date(task.start_time);
    return taskDate > today && taskDate <= nextWeek;
  }).slice(0, 3);
  
  // Quick stats
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.filter(task => !task.completed).length;
  const todayCompletedTasks = todayTasks.filter(task => task.completed).length;

  // Chart data
  const chartData = [
    {
      name: 'Total',
      value: tasks.length,
      color: '#B84C14'
    },
    {
      name: 'Completed',
      value: completedTasks,
      color: '#16a34a'
    },
    {
      name: 'Pending',
      value: pendingTasks,
      color: '#ea580c'
    },
    {
      name: 'Today Done',
      value: todayCompletedTasks,
      color: '#B84C14'
    }
  ];

  const handleToggleComplete = async (id: string, currentStatus: boolean) => {
    await toggleCompleteTask(id, currentStatus);
  };

  const handleTogglePin = async (id: string, currentStatus: boolean) => {
    await togglePinTask(id, currentStatus);
  };

  const getCategoryColor = (category: string) => {
    const categoryColors: Record<string, string> = {
      "Work": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      "Personal": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      "Home": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      "Health": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    };
    
    return categoryColors[category] || "bg-gray-100 text-gray-800 dark:bg-dincharya-muted/30 dark:text-gray-300";
  };
  
  const renderTaskItem = (task: Task) => {
    return (
      <div 
        key={task.id}
        className="flex items-center p-3 bg-white dark:bg-dincharya-muted/20 rounded-lg border border-dincharya-border/20 hover:border-dincharya-primary/30 transition-colors"
      >
        <div className="flex-shrink-0 mr-3">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => handleToggleComplete(task.id, task.completed)}
            className="h-4 w-4 rounded border-2 border-dincharya-primary text-dincharya-primary focus:ring-dincharya-primary"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className={cn(
            "text-sm font-medium",
            task.completed ? "line-through text-gray-500 dark:text-gray-400" : "text-dincharya-text dark:text-gray-200"
          )}>
            {task.title}
          </p>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
            <Clock className="h-3 w-3 mr-1" />
            {format(new Date(task.start_time), "h:mm a")}
          </div>
        </div>
        
        <div className="flex items-center ml-2 space-x-1">
          <Badge variant="secondary" className={getCategoryColor(task.category)}>
            {task.category}
          </Badge>
          {task.is_pinned && (
            <Pin className="h-3 w-3 text-dincharya-primary fill-current" />
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dincharya-background to-dincharya-muted/20 dark:from-dincharya-text dark:to-dincharya-muted/10">
        <div className="container mx-auto p-6 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dincharya-primary mx-auto mb-4"></div>
            <p className="text-dincharya-text dark:text-white">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dincharya-background to-dincharya-muted/20 dark:from-dincharya-text dark:to-dincharya-muted/10">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-dincharya-text dark:text-white">
              Welcome back{user ? `, ${user.email?.split('@')[0]}` : ''}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {format(today, "EEEE, MMMM d, yyyy")}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white dark:bg-dincharya-text/90 border-dincharya-border/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</p>
                  <p className="text-2xl font-bold text-dincharya-text dark:text-white">{tasks.length}</p>
                </div>
                <CheckSquare className="h-8 w-8 text-dincharya-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-dincharya-text/90 border-dincharya-border/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
                </div>
                <CheckSquare className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-dincharya-text/90 border-dincharya-border/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-orange-600">{pendingTasks}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-dincharya-text/90 border-dincharya-border/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Today Done</p>
                  <p className="text-2xl font-bold text-dincharya-primary">{todayCompletedTasks}/{todayTasks.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-dincharya-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Tasks */}
          <Card className="bg-white dark:bg-dincharya-text/90 border-dincharya-border/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-dincharya-text dark:text-white flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-dincharya-primary" />
                  Today's Tasks
                </CardTitle>
                <TaskForm />
              </div>
            </CardHeader>
            <CardContent>
              {todayTasks.length > 0 ? (
                <div className="space-y-3">
                  {todayTasks.map(renderTaskItem)}
                  {tasks.filter(task => {
                    const taskDate = new Date(task.start_time);
                    taskDate.setHours(0, 0, 0, 0);
                    return taskDate.getTime() === today.getTime();
                  }).length > 5 && (
                    <Button 
                      variant="ghost" 
                      className="w-full text-dincharya-primary hover:text-dincharya-primary/80"
                      onClick={() => navigate('/tasks')}
                    >
                      View all today's tasks <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">No tasks scheduled for today</p>
                  <TaskForm />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pinned Tasks */}
          <Card className="bg-white dark:bg-dincharya-text/90 border-dincharya-border/20">
            <CardHeader>
              <CardTitle className="text-xl text-dincharya-text dark:text-white flex items-center">
                <Pin className="h-5 w-5 mr-2 text-dincharya-primary fill-current" />
                Pinned Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pinnedTasks.length > 0 ? (
                <div className="space-y-3">
                  {pinnedTasks.map(renderTaskItem)}
                  {tasks.filter(task => task.is_pinned).length > 3 && (
                    <Button 
                      variant="ghost" 
                      className="w-full text-dincharya-primary hover:text-dincharya-primary/80"
                      onClick={() => navigate('/tasks')}
                    >
                      View all pinned tasks <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Pin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No pinned tasks yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Task Analytics */}
          <Card className="bg-white dark:bg-dincharya-text/90 border-dincharya-border/20">
            <CardHeader>
              <CardTitle className="text-xl text-dincharya-text dark:text-white flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-dincharya-primary" />
                Task Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Bar dataKey="value" fill="#B84C14" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Tasks and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Tasks */}
          <Card className="bg-white dark:bg-dincharya-text/90 border-dincharya-border/20">
            <CardHeader>
              <CardTitle className="text-xl text-dincharya-text dark:text-white flex items-center">
                <Clock className="h-5 w-5 mr-2 text-dincharya-primary" />
                Upcoming
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">Next 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingTasks.length > 0 ? (
                <div className="space-y-3">
                  {upcomingTasks.map(renderTaskItem)}
                  <Button 
                    variant="ghost" 
                    className="w-full text-dincharya-primary hover:text-dincharya-primary/80"
                    onClick={() => navigate('/tasks')}
                  >
                    View all tasks <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No upcoming tasks</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gradient-to-br from-dincharya-primary to-dincharya-secondary text-white">
            <CardHeader>
              <CardTitle className="text-xl text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="bg-white/20 text-white border-white/40 hover:bg-white/30 backdrop-blur-sm"
                  onClick={() => navigate('/tasks')}
                >
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Tasks
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-white/20 text-white border-white/40 hover:bg-white/30 backdrop-blur-sm"
                  onClick={() => navigate('/timer')}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Timer
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-white/20 text-white border-white/40 hover:bg-white/30 backdrop-blur-sm"
                  onClick={() => navigate('/notes')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Notes
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-white/20 text-white border-white/40 hover:bg-white/30 backdrop-blur-sm"
                  onClick={() => navigate('/analytics')}
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Analytics
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

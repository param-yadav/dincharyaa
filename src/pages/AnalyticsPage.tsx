
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTasks } from "@/hooks/use-tasks";

const AnalyticsPage = () => {
  const { tasks, loading } = useTasks();

  // Generate task completion data
  const tasksByCategory = tasks.reduce((acc: Record<string, number>, task) => {
    const category = task.category || "Uncategorized";
    if (!acc[category]) acc[category] = 0;
    acc[category]++;
    return acc;
  }, {});

  const categoryData = Object.keys(tasksByCategory).map(category => ({
    name: category,
    tasks: tasksByCategory[category]
  }));

  // Generate task priority data
  const tasksByPriority = tasks.reduce((acc: Record<string, number>, task) => {
    const priority = task.priority || "Uncategorized";
    if (!acc[priority]) acc[priority] = 0;
    acc[priority]++;
    return acc;
  }, {});

  const priorityData = Object.keys(tasksByPriority).map(priority => ({
    name: priority,
    tasks: tasksByPriority[priority]
  }));

  // Generate task completion status data
  const completionData = [
    { name: "Completed", value: tasks.filter(task => task.completed).length },
    { name: "Pending", value: tasks.filter(task => !task.completed).length }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-dincharya-text dark:text-white mb-6">Task Analytics</h1>
      
      <Tabs defaultValue="overview" className="mb-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="priorities">Priorities</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tasks.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tasks.filter(task => task.completed).length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tasks.filter(task => !task.completed).length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">High Priority</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tasks.filter(task => task.priority === "high").length}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Task Completion Status</CardTitle>
              <CardDescription>Overview of completed vs pending tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={completionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" name="Tasks" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Tasks by Category</CardTitle>
              <CardDescription>Distribution of tasks across different categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="tasks" fill="#82ca9d" name="Tasks" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="priorities" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Tasks by Priority</CardTitle>
              <CardDescription>Distribution of tasks by priority level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priorityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="tasks" fill="#ffc658" name="Tasks" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsPage;

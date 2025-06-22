
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { useUserTestAnalytics } from "@/hooks/use-tests";
import { Calendar, TrendingUp, Target, Clock } from "lucide-react";

const TestAnalytics = () => {
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");
  const { data: analytics, isLoading } = useUserTestAnalytics(period);

  const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"];

  // Mock subject-wise data for demonstration
  const subjectData = [
    { subject: "Reasoning", score: 85, attempts: 12 },
    { subject: "Mathematics", score: 78, attempts: 12 },
    { subject: "English", score: 92, attempts: 12 },
    { subject: "General Knowledge", score: 71, attempts: 12 },
  ];

  const accuracyData = [
    { name: "Correct", value: 75, color: "#10b981" },
    { name: "Incorrect", value: 20, color: "#ef4444" },
    { name: "Unanswered", value: 5, color: "#6b7280" },
  ];

  const formatPeriodData = (data: any[]) => {
    return data?.map(item => ({
      ...item,
      period_date: new Date(item.period_date).toLocaleDateString(),
      avg_score: parseFloat(item.avg_score),
      avg_accuracy: parseFloat(item.avg_accuracy),
    })) || [];
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-dincharya-text dark:text-white">Test Analytics</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse bg-white/50 dark:bg-dincharya-text/20">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const chartData = formatPeriodData(analytics || []);
  const totalAttempts = chartData.reduce((sum, item) => sum + item.total_attempts, 0);
  const avgScore = chartData.length > 0 ? chartData.reduce((sum, item) => sum + item.avg_score, 0) / chartData.length : 0;
  const avgAccuracy = chartData.length > 0 ? chartData.reduce((sum, item) => sum + item.avg_accuracy, 0) / chartData.length : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-dincharya-text dark:text-white">Test Analytics</h2>
        <Select value={period} onValueChange={(value: "week" | "month" | "year") => setPeriod(value)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Weekly</SelectItem>
            <SelectItem value="month">Monthly</SelectItem>
            <SelectItem value="year">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-dincharya-text/90 border-dincharya-border/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Attempts</p>
                <p className="text-2xl font-bold text-dincharya-text dark:text-white">{totalAttempts}</p>
              </div>
              <Calendar className="h-8 w-8 text-dincharya-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-dincharya-text/90 border-dincharya-border/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Average Score</p>
                <p className="text-2xl font-bold text-dincharya-text dark:text-white">{avgScore.toFixed(1)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-dincharya-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-dincharya-text/90 border-dincharya-border/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Average Accuracy</p>
                <p className="text-2xl font-bold text-dincharya-text dark:text-white">{avgAccuracy.toFixed(1)}%</p>
              </div>
              <Target className="h-8 w-8 text-dincharya-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-dincharya-text/90 border-dincharya-border/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Study Time</p>
                <p className="text-2xl font-bold text-dincharya-text dark:text-white">24h</p>
              </div>
              <Clock className="h-8 w-8 text-dincharya-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Trend */}
        <Card className="bg-white dark:bg-dincharya-text/90 border-dincharya-border/20">
          <CardHeader>
            <CardTitle className="text-dincharya-text dark:text-white">Score Trend</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Your performance over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period_date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="avg_score" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Average Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Subject Performance */}
        <Card className="bg-white dark:bg-dincharya-text/90 border-dincharya-border/20">
          <CardHeader>
            <CardTitle className="text-dincharya-text dark:text-white">Subject Performance</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Performance by subject area
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Accuracy Distribution */}
        <Card className="bg-white dark:bg-dincharya-text/90 border-dincharya-border/20">
          <CardHeader>
            <CardTitle className="text-dincharya-text dark:text-white">Answer Distribution</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Correct vs incorrect answers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={accuracyData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {accuracyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Accuracy Trend */}
        <Card className="bg-white dark:bg-dincharya-text/90 border-dincharya-border/20">
          <CardHeader>
            <CardTitle className="text-dincharya-text dark:text-white">Accuracy Trend</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Accuracy percentage over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period_date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="avg_accuracy" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Accuracy %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestAnalytics;

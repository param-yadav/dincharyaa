import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer, Target, TrendingUp, Calendar, CheckCircle2, Play, Pause, BarChart3 } from "lucide-react";
import { useProductivity } from "@/hooks/use-productivity";
import { useHabits } from "@/hooks/use-habits";
import { useRoutines } from "@/hooks/use-routines";
import TimeTracker from "@/components/productivity/TimeTracker";
import ProductivityInsights from "@/components/productivity/ProductivityInsights";
import GoalsManager from "@/components/productivity/GoalsManager";
import HabitsTracker from "@/components/productivity/HabitsTracker";
import RoutinesManager from "@/components/productivity/RoutinesManager";

const ProductivityPage = () => {
  const { currentEntry, getTodaySummary, loading: productivityLoading } = useProductivity();
  const { getTodaysProgress, loading: habitsLoading } = useHabits();
  const { templates, loading: routinesLoading } = useRoutines();

  const todaysSummary = getTodaySummary();
  const habitsProgress = getTodaysProgress();

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (productivityLoading || habitsLoading || routinesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dincharya-primary mx-auto"></div>
          <p className="mt-4 text-dincharya-muted">Loading your productivity data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dincharya-background to-dincharya-muted/20 dark:from-dincharya-text dark:to-dincharya-muted/10">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-dincharya-text dark:text-white mb-2">
            Productivity Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your time, build habits, and achieve your goals
          </p>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/50 dark:bg-dincharya-text/20 border-dincharya-muted/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Session</CardTitle>
              {currentEntry ? <Play className="h-4 w-4 text-green-600" /> : <Pause className="h-4 w-4 text-gray-400" />}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {currentEntry ? "Running" : "Stopped"}
              </div>
              <p className="text-xs text-dincharya-muted">
                {currentEntry ? currentEntry.title : "No active session"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-dincharya-text/20 border-dincharya-muted/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Focus</CardTitle>
              <Timer className="h-4 w-4 text-dincharya-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatTime(todaysSummary.productiveTime)}
              </div>
              <p className="text-xs text-dincharya-muted">
                {todaysSummary.sessionsCount} sessions completed
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-dincharya-text/20 border-dincharya-muted/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Habits</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {habitsProgress.completed}/{habitsProgress.total}
              </div>
              <p className="text-xs text-dincharya-muted">
                {Math.round(habitsProgress.percentage)}% completed today
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-dincharya-text/20 border-dincharya-muted/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Routines</CardTitle>
              <Calendar className="h-4 w-4 text-dincharya-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {templates.length}
              </div>
              <p className="text-xs text-dincharya-muted">
                Active routine templates
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="tracker" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/50 dark:bg-dincharya-text/20">
            <TabsTrigger value="tracker" className="flex items-center gap-2">
              <Timer className="w-4 h-4" />
              <span className="hidden sm:inline">Time Tracker</span>
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Goals</span>
            </TabsTrigger>
            <TabsTrigger value="habits" className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span className="hidden sm:inline">Habits</span>
            </TabsTrigger>
            <TabsTrigger value="routines" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Routines</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Insights</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tracker" className="space-y-6">
            <TimeTracker />
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <GoalsManager />
          </TabsContent>

          <TabsContent value="habits" className="space-y-6">
            <HabitsTracker />
          </TabsContent>

          <TabsContent value="routines" className="space-y-6">
            <RoutinesManager />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <ProductivityInsights />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductivityPage;
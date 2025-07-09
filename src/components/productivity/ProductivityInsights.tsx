import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Clock, TrendingUp, Calendar, Target, Zap } from "lucide-react";
import { useProductivity, ProductivityCategory } from "@/hooks/use-productivity";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

const ProductivityInsights = () => {
  const { timeEntries, goals, insights, getTodaySummary } = useProductivity();
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("7");
  const [analytics, setAnalytics] = useState<any[]>([]);

  const todaysSummary = getTodaySummary();

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange, user]);

  const fetchAnalytics = async () => {
    if (!user) return;

    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(timeRange));

      const { data, error } = await supabase.rpc("get_productivity_analytics", {
        p_user_id: user.id,
        p_start_date: startDate.toISOString().split('T')[0],
        p_end_date: endDate.toISOString().split('T')[0]
      });

      if (error) throw error;
      setAnalytics(data || []);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getWeeklyStats = () => {
    const pastWeek = timeEntries.filter(entry => {
      const entryDate = new Date(entry.start_time);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate >= weekAgo;
    });

    const totalTime = pastWeek.reduce((sum, entry) => sum + (entry.duration_minutes || 0), 0);
    const productiveTime = pastWeek
      .filter(entry => entry.category !== 'break')
      .reduce((sum, entry) => sum + (entry.duration_minutes || 0), 0);

    const categoryBreakdown = pastWeek.reduce((acc, entry) => {
      if (!entry.duration_minutes) return acc;
      acc[entry.category] = (acc[entry.category] || 0) + entry.duration_minutes;
      return acc;
    }, {} as Record<ProductivityCategory, number>);

    return {
      totalTime,
      productiveTime,
      categoryBreakdown,
      avgProductivity: pastWeek.length > 0 
        ? pastWeek.reduce((sum, entry) => sum + (entry.productivity_rating || 0), 0) / pastWeek.length
        : 0
    };
  };

  const getGoalsProgress = () => {
    const activeGoals = goals.filter(goal => goal.status !== 'completed');
    const completedGoals = goals.filter(goal => goal.status === 'completed');
    
    const totalProgress = activeGoals.reduce((sum, goal) => {
      const progress = goal.target_value ? (goal.current_value / goal.target_value) * 100 : 0;
      return sum + Math.min(progress, 100);
    }, 0);

    const avgProgress = activeGoals.length > 0 ? totalProgress / activeGoals.length : 0;

    return {
      activeGoals: activeGoals.length,
      completedGoals: completedGoals.length,
      avgProgress
    };
  };

  const weeklyStats = getWeeklyStats();
  const goalsProgress = getGoalsProgress();

  const getCategoryColor = (category: ProductivityCategory) => {
    const colors = {
      work: "bg-blue-500",
      study: "bg-green-500",
      exercise: "bg-red-500",
      personal: "bg-purple-500",
      break: "bg-gray-500",
      meeting: "bg-yellow-500",
      project: "bg-indigo-500"
    };
    return colors[category];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-dincharya-text dark:text-white">
          Productivity Insights
        </h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="14">Last 14 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Today's Summary */}
      <Card className="bg-white/50 dark:bg-dincharya-text/20 border-dincharya-muted/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today's Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-dincharya-primary">
                {formatTime(todaysSummary.productiveTime)}
              </div>
              <div className="text-sm text-dincharya-muted">Productive Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-dincharya-secondary">
                {formatTime(todaysSummary.breakTime)}
              </div>
              <div className="text-sm text-dincharya-muted">Break Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {todaysSummary.sessionsCount}
              </div>
              <div className="text-sm text-dincharya-muted">Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {todaysSummary.avgProductivity > 0 ? todaysSummary.avgProductivity.toFixed(1) : "0"}
              </div>
              <div className="text-sm text-dincharya-muted">Avg Rating</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Overview */}
        <Card className="bg-white/50 dark:bg-dincharya-text/20 border-dincharya-muted/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Weekly Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-lg font-semibold">{formatTime(weeklyStats.totalTime)}</div>
                <div className="text-sm text-dincharya-muted">Total Time</div>
              </div>
              <div>
                <div className="text-lg font-semibold">{formatTime(weeklyStats.productiveTime)}</div>
                <div className="text-sm text-dincharya-muted">Productive Time</div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium">Time by Category</h4>
              {Object.entries(weeklyStats.categoryBreakdown)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([category, minutes]) => {
                  const percentage = weeklyStats.totalTime > 0 
                    ? (minutes / weeklyStats.totalTime) * 100 
                    : 0;
                  
                  return (
                    <div key={category} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getCategoryColor(category as ProductivityCategory)}`} />
                          <span className="text-sm capitalize">{category}</span>
                        </div>
                        <div className="text-sm text-dincharya-muted">
                          {formatTime(minutes)} ({percentage.toFixed(1)}%)
                        </div>
                      </div>
                      <Progress value={percentage} className="h-1" />
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        {/* Goals Progress */}
        <Card className="bg-white/50 dark:bg-dincharya-text/20 border-dincharya-muted/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Goals Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-lg font-semibold">{goalsProgress.activeGoals}</div>
                <div className="text-sm text-dincharya-muted">Active Goals</div>
              </div>
              <div>
                <div className="text-lg font-semibold">{goalsProgress.completedGoals}</div>
                <div className="text-sm text-dincharya-muted">Completed</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Average Progress</span>
                <span className="text-sm">{Math.round(goalsProgress.avgProgress)}%</span>
              </div>
              <Progress value={goalsProgress.avgProgress} className="h-2" />
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Recent Goals</h4>
              {goals.slice(0, 3).map((goal) => {
                const progress = goal.target_value 
                  ? (goal.current_value / goal.target_value) * 100 
                  : 0;
                
                return (
                  <div key={goal.id} className="flex items-center justify-between p-2 rounded bg-white/30 dark:bg-dincharya-text/10">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{goal.title}</div>
                      <div className="text-xs text-dincharya-muted">
                        {goal.current_value} / {goal.target_value || 0}
                      </div>
                    </div>
                    <div className="text-xs text-dincharya-muted">
                      {Math.round(progress)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Productivity Trends */}
      <Card className="bg-white/50 dark:bg-dincharya-text/20 border-dincharya-muted/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Productivity Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-white/30 dark:bg-dincharya-text/10">
              <Zap className="h-8 w-8 mx-auto text-yellow-500 mb-2" />
              <div className="text-lg font-semibold">
                {weeklyStats.avgProductivity > 0 ? weeklyStats.avgProductivity.toFixed(1) : "N/A"}
              </div>
              <div className="text-sm text-dincharya-muted">Average Focus Score</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/30 dark:bg-dincharya-text/10">
              <Clock className="h-8 w-8 mx-auto text-blue-500 mb-2" />
              <div className="text-lg font-semibold">
                {weeklyStats.totalTime > 0 ? Math.round(weeklyStats.totalTime / 7) : 0}m
              </div>
              <div className="text-sm text-dincharya-muted">Daily Average</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/30 dark:bg-dincharya-text/10">
              <Target className="h-8 w-8 mx-auto text-green-500 mb-2" />
              <div className="text-lg font-semibold">
                {weeklyStats.totalTime > 0 ? Math.round((weeklyStats.productiveTime / weeklyStats.totalTime) * 100) : 0}%
              </div>
              <div className="text-sm text-dincharya-muted">Productivity Ratio</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductivityInsights;
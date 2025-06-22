
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { useManualTestAnalytics } from "@/hooks/use-manual-tests";
import { Calendar, TrendingUp, Target, BookOpen } from "lucide-react";
import { format } from "date-fns";

const ManualTestAnalytics = () => {
  const { data: analyticsData, isLoading } = useManualTestAnalytics();

  if (isLoading) {
    return (
      <div className="space-y-6">
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

  if (!analyticsData || analyticsData.length === 0) {
    return (
      <Card className="bg-white dark:bg-dincharya-text/90 border-dincharya-border/20">
        <CardContent className="p-8 text-center">
          <Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-dincharya-text dark:text-white mb-2">
            No data available for analysis
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Enter some test scores to see detailed analytics and performance trends.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Process data for analytics
  const subjectWiseData = analyticsData.reduce((acc: any, item: any) => {
    const existing = acc.find((a: any) => a.subject === item.subject_name);
    if (existing) {
      existing.totalCorrect += item.correct_answers;
      existing.totalWrong += item.wrong_answers;
      existing.totalMarks += item.scored_marks;
      existing.totalQuestions += item.total_questions;
      existing.attempts += 1;
    } else {
      acc.push({
        subject: item.subject_name,
        totalCorrect: item.correct_answers,
        totalWrong: item.wrong_answers,
        totalMarks: item.scored_marks,
        totalQuestions: item.total_questions,
        attempts: 1,
        avgAccuracy: 0,
        avgScore: 0
      });
    }
    return acc;
  }, []);

  // Calculate averages
  subjectWiseData.forEach((subject: any) => {
    subject.avgAccuracy = Math.round((subject.totalCorrect / (subject.totalCorrect + subject.totalWrong)) * 100) || 0;
    subject.avgScore = Math.round(subject.totalMarks / subject.attempts);
  });

  // Timeline data
  const timelineData = analyticsData.reduce((acc: any, item: any) => {
    const testDate = item.manual_test_entries.test_date;
    const existing = acc.find((a: any) => a.date === testDate);
    if (existing) {
      existing.totalMarks += item.scored_marks;
      existing.accuracy = Math.round(((existing.accuracy * existing.count) + 
        (item.correct_answers / (item.correct_answers + item.wrong_answers)) * 100) / (existing.count + 1));
      existing.count += 1;
    } else {
      acc.push({
        date: testDate,
        totalMarks: item.scored_marks,
        accuracy: Math.round((item.correct_answers / (item.correct_answers + item.wrong_answers)) * 100) || 0,
        count: 1,
        formattedDate: format(new Date(testDate), "MMM dd")
      });
    }
    return acc;
  }, []).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const totalTests = [...new Set(analyticsData.map((item: any) => item.manual_test_entries.test_name))].length;
  const totalMarks = analyticsData.reduce((sum: number, item: any) => sum + item.scored_marks, 0);
  const totalQuestions = analyticsData.reduce((sum: number, item: any) => sum + item.total_questions, 0);
  const totalCorrect = analyticsData.reduce((sum: number, item: any) => sum + item.correct_answers, 0);
  const totalWrong = analyticsData.reduce((sum: number, item: any) => sum + item.wrong_answers, 0);
  const overallAccuracy = Math.round((totalCorrect / (totalCorrect + totalWrong)) * 100) || 0;

  const accuracyDistribution = [
    { name: "Correct", value: totalCorrect, color: "#10b981" },
    { name: "Wrong", value: totalWrong, color: "#ef4444" },
    { name: "Not Attempted", value: totalQuestions - totalCorrect - totalWrong, color: "#6b7280" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-dincharya-text dark:text-white">Test Performance Analytics</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-dincharya-text/90 border-dincharya-border/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Tests</p>
                <p className="text-2xl font-bold text-dincharya-text dark:text-white">{totalTests}</p>
              </div>
              <Calendar className="h-8 w-8 text-dincharya-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-dincharya-text/90 border-dincharya-border/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Marks</p>
                <p className="text-2xl font-bold text-dincharya-text dark:text-white">{totalMarks}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-dincharya-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-dincharya-text/90 border-dincharya-border/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Overall Accuracy</p>
                <p className="text-2xl font-bold text-dincharya-text dark:text-white">{overallAccuracy}%</p>
              </div>
              <Target className="h-8 w-8 text-dincharya-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-dincharya-text/90 border-dincharya-border/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Questions Attempted</p>
                <p className="text-2xl font-bold text-dincharya-text dark:text-white">{totalCorrect + totalWrong}</p>
              </div>
              <BookOpen className="h-8 w-8 text-dincharya-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Performance */}
        <Card className="bg-white dark:bg-dincharya-text/90 border-dincharya-border/20">
          <CardHeader>
            <CardTitle className="text-dincharya-text dark:text-white">Subject-wise Performance</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Average accuracy by subject
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectWiseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="avgAccuracy" fill="#3b82f6" name="Avg Accuracy %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Performance Timeline */}
        <Card className="bg-white dark:bg-dincharya-text/90 border-dincharya-border/20">
          <CardHeader>
            <CardTitle className="text-dincharya-text dark:text-white">Performance Timeline</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Marks scored over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="formattedDate" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="totalMarks" stroke="#3b82f6" strokeWidth={2} name="Total Marks" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Answer Distribution */}
        <Card className="bg-white dark:bg-dincharya-text/90 border-dincharya-border/20">
          <CardHeader>
            <CardTitle className="text-dincharya-text dark:text-white">Answer Distribution</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Overall answer breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={accuracyDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {accuracyDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Subject Scores */}
        <Card className="bg-white dark:bg-dincharya-text/90 border-dincharya-border/20">
          <CardHeader>
            <CardTitle className="text-dincharya-text dark:text-white">Subject-wise Scores</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Average marks by subject
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectWiseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="avgScore" fill="#10b981" name="Avg Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManualTestAnalytics;

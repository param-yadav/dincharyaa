
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ManualTestEntry from "@/components/tests/ManualTestEntry";
import ManualTestHistory from "@/components/tests/ManualTestHistory";
import ManualTestAnalytics from "@/components/tests/ManualTestAnalytics";

const TestsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dincharya-background to-dincharya-muted/20 dark:from-dincharya-text dark:to-dincharya-muted/10">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-dincharya-text dark:text-white mb-2">Test Performance Tracker</h1>
          <p className="text-gray-600 dark:text-gray-400">Enter your test scores manually and track your performance over time</p>
        </div>

        <Tabs defaultValue="entry" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/50 dark:bg-dincharya-text/20">
            <TabsTrigger value="entry">Enter Scores</TabsTrigger>
            <TabsTrigger value="history">Test History</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="entry" className="space-y-6">
            <ManualTestEntry />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <h2 className="text-2xl font-semibold text-dincharya-text dark:text-white">Test History</h2>
            <ManualTestHistory />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <ManualTestAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TestsPage;

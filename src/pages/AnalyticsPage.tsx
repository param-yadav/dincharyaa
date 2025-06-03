
import React from "react";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";

const AnalyticsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dincharya-background to-dincharya-muted/20 dark:from-dincharya-text dark:to-dincharya-muted/10">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-dincharya-text dark:text-white mb-2">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your productivity and progress</p>
        </div>
        
        <AnalyticsDashboard />
      </div>
    </div>
  );
};

export default AnalyticsPage;


import React from "react";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";

const AnalyticsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Analytics</h1>
          <p className="text-gray-600">Track your productivity and progress</p>
        </div>
        
        <AnalyticsDashboard />
      </div>
    </div>
  );
};

export default AnalyticsPage;

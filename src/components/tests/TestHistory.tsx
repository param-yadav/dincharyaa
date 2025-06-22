
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Calendar, Clock, Target } from "lucide-react";
import { useUserTests } from "@/hooks/use-tests";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const TestHistory = () => {
  const navigate = useNavigate();
  const { data: tests, isLoading } = useUserTests();

  const completedTests = tests?.filter(t => t.status === "completed") || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-dincharya-text dark:text-white">Test History</h2>
        
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse bg-white/50 dark:bg-dincharya-text/20">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                  <div className="h-10 bg-gray-300 rounded w-24"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (completedTests.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-dincharya-text dark:text-white">Test History</h2>
        
        <Card className="bg-white dark:bg-dincharya-text/90 border-dincharya-border/20">
          <CardContent className="p-8 text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-dincharya-text dark:text-white mb-2">
              No completed tests yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Complete some tests to see your history and track your progress.
            </p>
            <Button 
              onClick={() => navigate("/tests")}
              className="bg-dincharya-primary hover:bg-dincharya-secondary"
            >
              Take a Test
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-dincharya-text dark:text-white">Test History</h2>
        <p className="text-gray-600 dark:text-gray-400">
          {completedTests.length} test{completedTests.length !== 1 ? 's' : ''} completed
        </p>
      </div>

      <div className="space-y-4">
        {completedTests.map((test) => (
          <Card key={test.id} className="bg-white dark:bg-dincharya-text/90 border-dincharya-border/20 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-dincharya-text dark:text-white">
                      {test.template?.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {test.template?.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(test.test_date), "MMM dd, yyyy")}
                    </div>
                    {test.completed_at && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {format(new Date(test.completed_at), "hh:mm a")}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      {test.template?.total_questions} questions
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Badge variant={test.template?.test_type === "daily" ? "default" : "secondary"}>
                      {test.template?.test_type}
                    </Badge>
                    <Badge variant="outline" className="border-green-500 text-green-700">
                      Completed
                    </Badge>
                  </div>
                </div>

                <Button 
                  onClick={() => navigate(`/tests/results/${test.id}`)}
                  variant="outline"
                  className="border-dincharya-border/30"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Results
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TestHistory;

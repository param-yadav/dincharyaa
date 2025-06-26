
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, BarChart3, Clock, Target, TrendingUp, Activity } from "lucide-react";
import { useEnhancedManualTests } from "@/hooks/use-enhanced-manual-tests";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const EnhancedTestHistory = () => {
  const { data: tests, isLoading } = useEnhancedManualTests();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse bg-white/50 dark:bg-dincharya-text/20">
            <CardContent className="p-6">
              <div className="space-y-2">
                <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!tests || tests.length === 0) {
    return (
      <Card className="bg-white dark:bg-dincharya-text/90 border-dincharya-border/20">
        <CardContent className="p-8 text-center">
          <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-dincharya-text dark:text-white mb-2">
            No test scores entered yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Start by creating a test format and entering your test scores.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {tests.map((test) => (
        <Card key={test.id} className="bg-white dark:bg-dincharya-text/90 border-dincharya-border/20 hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <CardTitle className="text-dincharya-text dark:text-white">{test.test_name}</CardTitle>
                {test.test_format && (
                  <Badge variant="outline" className="text-xs">
                    {test.test_format.format_name}
                  </Badge>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(test.test_date), "MMM dd, yyyy")}
                  </div>
                  {test.time_taken_minutes && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {test.time_taken_minutes} min
                    </div>
                  )}
                  {test.overall_percentage && (
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      {test.overall_percentage}%
                    </div>
                  )}
                  {test.overall_percentile && (
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      {test.overall_percentile} percentile
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {test.total_marks.toFixed(2)} marks
                </Badge>
                <Button 
                  onClick={() => navigate(`/tests/analysis/${test.id}`)}
                  className="bg-dincharya-primary hover:bg-dincharya-primary/90 text-white"
                  size="sm"
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Analysis
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {test.subjects?.map((subject) => (
                <div key={subject.id} className="p-4 bg-gray-50 dark:bg-dincharya-text/50 rounded-lg">
                  <h4 className="font-medium text-dincharya-text dark:text-white mb-3">
                    {subject.subject_name}
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-600">Correct:</span>
                      <span className="font-medium">{subject.correct_answers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-600">Wrong:</span>
                      <span className="font-medium">{subject.wrong_answers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Not Attempted:</span>
                      <span className="font-medium">{subject.not_attempted}</span>
                    </div>
                    <div className="border-t pt-2 mt-2 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-green-600">Positive:</span>
                        <span className="font-medium">+{subject.scored_marks}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-red-600">Negative:</span>
                        <span className="font-medium">-{subject.negative_marks.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-1">
                        <span className="text-dincharya-primary font-medium">Net Score:</span>
                        <span className="font-bold">{subject.net_marks.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Accuracy:</span>
                      <span className="font-medium">
                        {subject.correct_answers + subject.wrong_answers > 0 
                          ? Math.round((subject.correct_answers / (subject.correct_answers + subject.wrong_answers)) * 100)
                          : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EnhancedTestHistory;

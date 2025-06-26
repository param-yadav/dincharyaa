
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trophy, Target, Clock, TrendingUp, Users } from "lucide-react";
import { useEnhancedManualTests } from "@/hooks/use-enhanced-manual-tests";
import { format } from "date-fns";

const TestAnalysisPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { data: tests } = useEnhancedManualTests();
  
  const test = tests?.find(t => t.id === testId);
  
  if (!test) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dincharya-background to-dincharya-muted/20 p-6">
        <div className="max-w-4xl mx-auto">
          <Button 
            onClick={() => navigate("/tests")}
            variant="outline"
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tests
          </Button>
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-dincharya-text">Test not found</h2>
          </div>
        </div>
      </div>
    );
  }

  const totalQuestions = test.subjects?.reduce((sum, subject) => 
    sum + subject.total_questions, 0) || 0;
  
  const totalAttempted = test.subjects?.reduce((sum, subject) => 
    sum + subject.correct_answers + subject.wrong_answers, 0) || 0;
  
  const totalCorrect = test.subjects?.reduce((sum, subject) => 
    sum + subject.correct_answers, 0) || 0;
  
  const overallAccuracy = totalAttempted > 0 ? (totalCorrect / totalAttempted) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-dincharya-background to-dincharya-muted/20 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button 
            onClick={() => navigate("/tests")}
            variant="outline"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tests
          </Button>
          <Button 
            onClick={() => navigate(`/tests/edit/${testId}`)}
            className="bg-dincharya-primary hover:bg-dincharya-primary/90"
          >
            Edit Test Data
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dincharya-text mb-2">{test.test_name}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {format(new Date(test.test_date), "MMMM dd, yyyy")}
            </span>
            {test.time_taken_minutes && (
              <span>Time: {test.time_taken_minutes} minutes</span>
            )}
            {test.test_format && (
              <Badge variant="outline">{test.test_format.format_name}</Badge>
            )}
          </div>
        </div>

        {/* Overall Performance Summary */}
        <Card className="mb-8 bg-white dark:bg-dincharya-text/90">
          <CardHeader>
            <CardTitle className="text-xl text-dincharya-text dark:text-white">
              Overall Performance Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-red-100 rounded-full">
                  <Trophy className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-dincharya-text">
                    {test.total_marks.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-500">Score</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-dincharya-text">
                    {totalAttempted} / {totalQuestions}
                  </div>
                  <div className="text-sm text-gray-500">Attempted</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-dincharya-text">
                    {overallAccuracy.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-500">Accuracy</div>
                </div>
              </div>

              {test.overall_percentile && (
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-dincharya-text">
                      {test.overall_percentile}%
                    </div>
                    <div className="text-sm text-gray-500">Percentile</div>
                  </div>
                </div>
              )}

              {test.overall_percentage && (
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-cyan-100 rounded-full">
                    <Target className="h-6 w-6 text-cyan-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-dincharya-text">
                      {test.overall_percentage}%
                    </div>
                    <div className="text-sm text-gray-500">Percentage</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sectional Summary */}
        <Card className="bg-white dark:bg-dincharya-text/90">
          <CardHeader>
            <CardTitle className="text-xl text-dincharya-text dark:text-white">
              Sectional Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Section Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Score</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Attempted</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Accuracy</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {test.subjects?.map((subject, index) => {
                    const attempted = subject.correct_answers + subject.wrong_answers;
                    const accuracy = attempted > 0 ? (subject.correct_answers / attempted) * 100 : 0;
                    
                    return (
                      <tr key={subject.id} className="border-b hover:bg-gray-50 dark:hover:bg-dincharya-text/50">
                        <td className="py-4 px-4">
                          <div className="font-medium text-dincharya-text dark:text-white">
                            {subject.subject_name}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-20 h-3 bg-gray-200 rounded-full">
                              <div 
                                className="h-3 bg-purple-500 rounded-full" 
                                style={{ width: `${Math.max(10, (subject.net_marks / (subject.total_questions * subject.marks_per_question)) * 100)}%` }}
                              />
                            </div>
                            <span className="font-medium text-dincharya-text">
                              {subject.net_marks.toFixed(1)} / {(subject.total_questions * subject.marks_per_question).toFixed(1)}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-20 h-3 bg-gray-200 rounded-full">
                              <div 
                                className="h-3 bg-cyan-500 rounded-full" 
                                style={{ width: `${Math.max(10, (attempted / subject.total_questions) * 100)}%` }}
                              />
                            </div>
                            <span className="text-dincharya-text">
                              {attempted} / {subject.total_questions}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-20 h-3 bg-gray-200 rounded-full">
                              <div 
                                className="h-3 bg-green-500 rounded-full" 
                                style={{ width: `${Math.max(10, accuracy)}%` }}
                              />
                            </div>
                            <span className="text-dincharya-text">{accuracy.toFixed(1)}%</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm space-y-1">
                            <div className="text-green-600">✓ {subject.correct_answers} Correct</div>
                            <div className="text-red-600">✗ {subject.wrong_answers} Wrong</div>
                            <div className="text-gray-500">— {subject.not_attempted} Not Attempted</div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  
                  {/* Overall Row */}
                  <tr className="border-t-2 border-gray-300 bg-gray-50 dark:bg-dincharya-text/30">
                    <td className="py-4 px-4">
                      <div className="font-bold text-dincharya-text dark:text-white">Overall</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-3 bg-gray-200 rounded-full">
                          <div className="h-3 bg-purple-500 rounded-full" style={{ width: "70%" }} />
                        </div>
                        <span className="font-bold text-dincharya-text">
                          {test.total_marks.toFixed(1)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-3 bg-gray-200 rounded-full">
                          <div 
                            className="h-3 bg-cyan-500 rounded-full" 
                            style={{ width: `${Math.max(10, (totalAttempted / totalQuestions) * 100)}%` }}
                          />
                        </div>
                        <span className="font-bold text-dincharya-text">
                          {totalAttempted} / {totalQuestions}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-3 bg-gray-200 rounded-full">
                          <div 
                            className="h-3 bg-green-500 rounded-full" 
                            style={{ width: `${Math.max(10, overallAccuracy)}%` }}
                          />
                        </div>
                        <span className="font-bold text-dincharya-text">{overallAccuracy.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {test.time_taken_minutes && (
                        <div className="text-sm font-medium text-gray-600">
                          {Math.floor(test.time_taken_minutes / 60)}:{(test.time_taken_minutes % 60).toString().padStart(2, '0')} min
                        </div>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestAnalysisPage;

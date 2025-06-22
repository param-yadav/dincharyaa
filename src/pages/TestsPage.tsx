
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, BookOpen, BarChart3, Plus, Play, Eye } from "lucide-react";
import { useTestTemplates, useCreateDailyTestTemplate } from "@/hooks/use-test-templates";
import { useUserTests, useCreateTest } from "@/hooks/use-tests";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import TestAnalytics from "@/components/tests/TestAnalytics";
import CreateTestDialog from "@/components/tests/CreateTestDialog";
import TestHistory from "@/components/tests/TestHistory";

const TestsPage = () => {
  const navigate = useNavigate();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { data: templates, isLoading: templatesLoading } = useTestTemplates();
  const { data: userTests, isLoading: testsLoading } = useUserTests();
  const createDailyTemplate = useCreateDailyTestTemplate();
  const createTest = useCreateTest();

  const handleCreateDailyTest = async () => {
    await createDailyTemplate.mutateAsync();
  };

  const handleStartTest = async (templateId: string) => {
    const testDate = format(new Date(), "yyyy-MM-dd");
    const result = await createTest.mutateAsync({ templateId, testDate });
    navigate(`/tests/take/${result.id}`);
  };

  const availableTemplates = templates?.filter(t => !userTests?.some(ut => 
    ut.template_id === t.id && 
    ut.test_date === format(new Date(), "yyyy-MM-dd")
  )) || [];

  const todaysTests = userTests?.filter(t => 
    t.test_date === format(new Date(), "yyyy-MM-dd")
  ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dincharya-background to-dincharya-muted/20 dark:from-dincharya-text dark:to-dincharya-muted/10">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-dincharya-text dark:text-white mb-2">Tests</h1>
          <p className="text-gray-600 dark:text-gray-400">Practice daily tests and track your progress</p>
        </div>

        <Tabs defaultValue="available" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/50 dark:bg-dincharya-text/20">
            <TabsTrigger value="available">Available Tests</TabsTrigger>
            <TabsTrigger value="today">Today's Tests</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-dincharya-text dark:text-white">Available Tests</h2>
              <div className="space-x-2">
                <Button 
                  onClick={handleCreateDailyTest}
                  disabled={createDailyTemplate.isPending}
                  className="bg-dincharya-primary hover:bg-dincharya-secondary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Daily Test
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateDialog(true)}
                  className="border-dincharya-border/30"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Custom Test
                </Button>
              </div>
            </div>

            {templatesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="animate-pulse bg-white/50 dark:bg-dincharya-text/20">
                    <CardHeader className="space-y-2">
                      <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableTemplates?.map((template) => (
                  <Card key={template.id} className="bg-white dark:bg-dincharya-text/90 border-dincharya-border/20 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-dincharya-text dark:text-white flex items-center justify-between">
                        {template.name}
                        <Badge variant={template.test_type === "daily" ? "default" : "secondary"}>
                          {template.test_type}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {template.total_questions} Questions
                        </div>
                        <div className="flex items-center gap-1">
                          <BarChart3 className="h-4 w-4" />
                          {template.total_marks} Marks
                        </div>
                      </div>
                      {template.time_limit_minutes && (
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="h-4 w-4" />
                          {template.time_limit_minutes} minutes
                        </div>
                      )}
                      <Button 
                        onClick={() => handleStartTest(template.id)}
                        className="w-full bg-dincharya-primary hover:bg-dincharya-secondary"
                        disabled={createTest.isPending}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Test
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="today" className="space-y-6">
            <h2 className="text-2xl font-semibold text-dincharya-text dark:text-white">Today's Tests</h2>
            
            {testsLoading ? (
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <Card key={i} className="animate-pulse bg-white/50 dark:bg-dincharya-text/20">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div className="space-y-2">
                          <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                        <div className="h-10 bg-gray-300 rounded w-24"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : todaysTests.length === 0 ? (
              <Card className="bg-white dark:bg-dincharya-text/90 border-dincharya-border/20">
                <CardContent className="p-8 text-center">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-dincharya-text dark:text-white mb-2">
                    No tests scheduled for today
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Create a new test from the available templates to get started.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {todaysTests.map((test) => (
                  <Card key={test.id} className="bg-white dark:bg-dincharya-text/90 border-dincharya-border/20">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-semibold text-dincharya-text dark:text-white">
                            {test.template?.name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            {test.template?.total_questions} questions • {test.template?.total_marks} marks
                          </p>
                          <Badge variant={
                            test.status === "completed" ? "default" : 
                            test.status === "in_progress" ? "secondary" : "outline"
                          }>
                            {test.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="space-x-2">
                          {test.status === "not_started" && (
                            <Button 
                              onClick={() => navigate(`/tests/take/${test.id}`)}
                              className="bg-dincharya-primary hover:bg-dincharya-secondary"
                            >
                              <Play className="h-4 w-4 mr-2" />
                              Start
                            </Button>
                          )}
                          {test.status === "in_progress" && (
                            <Button 
                              onClick={() => navigate(`/tests/take/${test.id}`)}
                              variant="outline"
                              className="border-dincharya-border/30"
                            >
                              Continue
                            </Button>
                          )}
                          {test.status === "completed" && (
                            <Button 
                              onClick={() => navigate(`/tests/results/${test.id}`)}
                              variant="outline"
                              className="border-dincharya-border/30"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Results
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            <TestHistory />
          </TabsContent>

          <TabsContent value="analytics">
            <TestAnalytics />
          </TabsContent>
        </Tabs>

        <CreateTestDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
      </div>
    </div>
  );
};

export default TestsPage;

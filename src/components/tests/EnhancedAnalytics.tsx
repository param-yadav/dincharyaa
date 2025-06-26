
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  Clock, 
  Target, 
  Trophy, 
  Plus, 
  Folder, 
  Edit, 
  Trash2,
  BookOpen,
  Calculator,
  Timer
} from "lucide-react";
import { useEnhancedManualTests, useDeleteManualTest } from "@/hooks/use-enhanced-manual-tests";
import { useTestFormats, useDeleteTestFormat } from "@/hooks/use-test-formats";
import { format } from "date-fns";

interface TestFolder {
  id: string;
  name: string;
  formatId: string;
  tests: any[];
}

const EnhancedAnalytics = () => {
  const { data: tests } = useEnhancedManualTests();
  const { data: testFormats } = useTestFormats();
  const deleteTest = useDeleteManualTest();
  const deleteFormat = useDeleteTestFormat();
  
  const [folders, setFolders] = useState<TestFolder[]>([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedFormatId, setSelectedFormatId] = useState("");
  const [showCreateFolder, setShowCreateFolder] = useState(false);

  // Calculate overall statistics
  const totalTests = tests?.length || 0;
  const totalQuestions = tests?.reduce((sum, test) => sum + test.total_questions, 0) || 0;
  const totalAttempted = tests?.reduce((sum, test) => sum + (test.total_correct + test.total_wrong), 0) || 0;
  const totalTime = tests?.reduce((sum, test) => sum + (test.time_taken_minutes || 0), 0) || 0;

  // Group tests by format
  const testsByFormat = tests?.reduce((acc, test) => {
    const formatName = test.test_format?.format_name || "Other";
    if (!acc[formatName]) {
      acc[formatName] = [];
    }
    acc[formatName].push(test);
    return acc;
  }, {} as Record<string, any[]>) || {};

  const createFolder = () => {
    if (!newFolderName.trim() || !selectedFormatId) return;
    
    const selectedFormat = testFormats?.find(f => f.id === selectedFormatId);
    if (!selectedFormat) return;

    const testsForFormat = tests?.filter(test => test.format_id === selectedFormatId) || [];
    
    const newFolder: TestFolder = {
      id: Date.now().toString(),
      name: newFolderName.trim(),
      formatId: selectedFormatId,
      tests: testsForFormat
    };

    setFolders([...folders, newFolder]);
    setNewFolderName("");
    setSelectedFormatId("");
    setShowCreateFolder(false);
  };

  const handleDeleteTest = async (testId: string) => {
    if (window.confirm("Are you sure you want to delete this test?")) {
      await deleteTest.mutateAsync(testId);
    }
  };

  const handleDeleteFormat = async (formatId: string) => {
    if (window.confirm("Are you sure you want to delete this test format? This will affect all tests using this format.")) {
      await deleteFormat.mutateAsync(formatId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white dark:bg-dincharya-text/90">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTests}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total Questions: {totalQuestions}
            </p>
            <p className="text-xs text-muted-foreground">
              Attempted: {totalAttempted}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-dincharya-text/90">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Format Stats</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.keys(testsByFormat).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Different formats used
            </p>
            <div className="mt-2 space-y-1">
              {Object.entries(testsByFormat).slice(0, 2).map(([format, formatTests]) => (
                <div key={format} className="flex justify-between text-xs">
                  <span>{format}:</span>
                  <span>{formatTests.length} tests</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-dincharya-text/90">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Time</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(totalTime / 60)}h {totalTime % 60}m
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Average: {totalTests > 0 ? Math.round(totalTime / totalTests) : 0} min/test
            </p>
            <p className="text-xs text-muted-foreground">
              Total sessions: {totalTests}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="folders">Folders</TabsTrigger>
          <TabsTrigger value="formats">Test Formats</TabsTrigger>
          <TabsTrigger value="tests">All Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="bg-white dark:bg-dincharya-text/90">
            <CardHeader>
              <CardTitle>Performance by Format</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(testsByFormat).map(([formatName, formatTests]) => {
                  const avgScore = formatTests.reduce((sum, test) => sum + test.total_marks, 0) / formatTests.length;
                  const avgAccuracy = formatTests.reduce((sum, test) => {
                    const attempted = test.total_correct + test.total_wrong;
                    return sum + (attempted > 0 ? (test.total_correct / attempted) * 100 : 0);
                  }, 0) / formatTests.length;

                  return (
                    <div key={formatName} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{formatName}</h3>
                        <p className="text-sm text-gray-600">{formatTests.length} tests</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{avgScore.toFixed(1)} marks</div>
                        <div className="text-sm text-gray-600">{avgAccuracy.toFixed(1)}% accuracy</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="folders" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Test Folders</h2>
            <Dialog open={showCreateFolder} onOpenChange={setShowCreateFolder}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Folder
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Test Folder</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="folderName">Folder Name</Label>
                    <Input
                      id="folderName"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      placeholder="Enter folder name"
                    />
                  </div>
                  <div>
                    <Label>Select Test Format</Label>
                    <Select value={selectedFormatId} onValueChange={setSelectedFormatId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a test format" />
                      </SelectTrigger>
                      <SelectContent>
                        {testFormats?.map((format) => (
                          <SelectItem key={format.id} value={format.id}>
                            {format.format_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={createFolder} className="w-full">
                    Create Folder
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {folders.map((folder) => (
              <Card key={folder.id} className="bg-white dark:bg-dincharya-text/90">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Folder className="h-4 w-4" />
                    {folder.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{folder.tests.length} tests</p>
                  <div className="space-y-2">
                    {folder.tests.slice(0, 3).map((test) => (
                      <div key={test.id} className="flex justify-between items-center text-sm">
                        <span>{test.test_name}</span>
                        <Badge variant="outline">{test.total_marks.toFixed(1)}</Badge>
                      </div>
                    ))}
                    {folder.tests.length > 3 && (
                      <p className="text-xs text-gray-500">+{folder.tests.length - 3} more tests</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="formats" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Test Formats</h2>
          </div>

          <div className="space-y-4">
            {testFormats?.map((format) => (
              <Card key={format.id} className="bg-white dark:bg-dincharya-text/90">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">{format.format_name}</h3>
                      {format.description && (
                        <p className="text-gray-600">{format.description}</p>
                      )}
                      <div className="flex gap-4 text-sm text-gray-500">
                        {format.total_time_minutes && (
                          <span>Duration: {format.total_time_minutes} minutes</span>
                        )}
                        <span>Subjects: {format.test_format_subjects?.length || 0}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteFormat(format.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tests" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">All Tests</h2>
          </div>

          <div className="space-y-4">
            {tests?.map((test) => (
              <Card key={test.id} className="bg-white dark:bg-dincharya-text/90">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">{test.test_name}</h3>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span>{format(new Date(test.test_date), "MMM dd, yyyy")}</span>
                        {test.test_format && (
                          <Badge variant="outline">{test.test_format.format_name}</Badge>
                        )}
                      </div>
                      <div className="flex gap-4 text-sm">
                        <span className="text-green-600">Score: {test.total_marks.toFixed(1)}</span>
                        <span className="text-blue-600">
                          {test.total_correct}C / {test.total_wrong}W / {test.total_not_attempted}NA
                        </span>
                        {test.time_taken_minutes && (
                          <span className="text-purple-600">Time: {test.time_taken_minutes}m</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteTest(test.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAnalytics;

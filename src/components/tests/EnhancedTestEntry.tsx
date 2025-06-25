
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTestFormats } from "@/hooks/use-test-formats";
import { useCreateEnhancedManualTest } from "@/hooks/use-enhanced-manual-tests";
import CreateTestFormatDialog from "./CreateTestFormatDialog";

interface TestEntryData {
  subject_name: string;
  correct_answers: number;
  wrong_answers: number;
  total_questions: number;
  marks_per_question: number;
  negative_marking_ratio: number;
}

const EnhancedTestEntry = () => {
  const [selectedFormatId, setSelectedFormatId] = useState<string>("");
  const [testName, setTestName] = useState("");
  const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeTaken, setTimeTaken] = useState<number | undefined>();
  const [overallPercentage, setOverallPercentage] = useState<number | undefined>();
  const [overallPercentile, setOverallPercentile] = useState<number | undefined>();
  const [testData, setTestData] = useState<TestEntryData[]>([]);

  const { data: testFormats, isLoading: formatsLoading } = useTestFormats();
  const createEnhancedTest = useCreateEnhancedManualTest();

  const selectedFormat = testFormats?.find(f => f.id === selectedFormatId);

  const handleFormatSelect = (formatId: string) => {
    setSelectedFormatId(formatId);
    const format = testFormats?.find(f => f.id === formatId);
    if (format?.subjects) {
      setTestData(format.subjects.map(subject => ({
        subject_name: subject.subject_name,
        correct_answers: 0,
        wrong_answers: 0,
        total_questions: subject.total_questions,
        marks_per_question: subject.marks_per_question,
        negative_marking_ratio: subject.negative_marking_ratio,
      })));
    }
  };

  const updateTestData = (index: number, field: 'correct_answers' | 'wrong_answers', value: number) => {
    const updated = [...testData];
    updated[index] = { ...updated[index], [field]: value };
    setTestData(updated);
  };

  const calculateSubjectStats = (subject: TestEntryData) => {
    const notAttempted = subject.total_questions - subject.correct_answers - subject.wrong_answers;
    const scoredMarks = subject.correct_answers * subject.marks_per_question;
    const negativeMarks = subject.wrong_answers * subject.marks_per_question * subject.negative_marking_ratio;
    const netMarks = scoredMarks - negativeMarks;
    return { notAttempted, scoredMarks, negativeMarks, netMarks };
  };

  const calculateTotalMarks = () => {
    return testData.reduce((total, subject) => {
      const { netMarks } = calculateSubjectStats(subject);
      return total + netMarks;
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testName.trim() || testData.length === 0) return;

    await createEnhancedTest.mutateAsync({
      format_id: selectedFormatId || undefined,
      test_name: testName,
      test_date: testDate,
      time_taken_minutes: timeTaken,
      overall_percentage: overallPercentage,
      overall_percentile: overallPercentile,
      subjects: testData,
    });

    // Reset form
    setSelectedFormatId("");
    setTestName("");
    setTestDate(new Date().toISOString().split('T')[0]);
    setTimeTaken(undefined);
    setOverallPercentage(undefined);
    setOverallPercentile(undefined);
    setTestData([]);
  };

  if (formatsLoading) {
    return <div>Loading test formats...</div>;
  }

  return (
    <Card className="bg-white dark:bg-dincharya-text/90 border-dincharya-border/20">
      <CardHeader>
        <CardTitle className="text-dincharya-text dark:text-white">Add Test Score</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Select Test Format</Label>
            <Select value={selectedFormatId} onValueChange={handleFormatSelect}>
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

          <CreateTestFormatDialog />
        </div>

        {selectedFormat && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="testName">Test Name *</Label>
                <Input
                  id="testName"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  placeholder="e.g., SSC CGL Mock Test 1"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="testDate">Test Date *</Label>
                <Input
                  id="testDate"
                  type="date"
                  value={testDate}
                  onChange={(e) => setTestDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timeTaken">Time Taken (minutes)</Label>
                <Input
                  id="timeTaken"
                  type="number"
                  value={timeTaken || ""}
                  onChange={(e) => setTimeTaken(e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Optional"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="percentage">Overall Percentage (%)</Label>
                <Input
                  id="percentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={overallPercentage || ""}
                  onChange={(e) => setOverallPercentage(e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="Optional"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="percentile">Overall Percentile</Label>
                <Input
                  id="percentile"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={overallPercentile || ""}
                  onChange={(e) => setOverallPercentile(e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="Optional"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-dincharya-text dark:text-white">Subject-wise Performance</h3>
              
              {testData.map((subject, index) => {
                const stats = calculateSubjectStats(subject);
                return (
                  <Card key={index} className="p-4 bg-gray-50 dark:bg-dincharya-text/50">
                    <div className="space-y-4">
                      <h4 className="font-medium text-dincharya-text dark:text-white">
                        {subject.subject_name}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label>Correct Answers</Label>
                          <Input
                            type="number"
                            min="0"
                            max={subject.total_questions}
                            value={subject.correct_answers}
                            onChange={(e) => updateTestData(index, 'correct_answers', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Wrong Answers</Label>
                          <Input
                            type="number"
                            min="0"
                            max={subject.total_questions}
                            value={subject.wrong_answers}
                            onChange={(e) => updateTestData(index, 'wrong_answers', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Not Attempted</Label>
                          <Input
                            type="number"
                            value={stats.notAttempted}
                            disabled
                            className="bg-gray-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Net Marks</Label>
                          <Input
                            type="number"
                            value={stats.netMarks.toFixed(2)}
                            disabled
                            className="bg-gray-200 font-bold"
                          />
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Total Questions: {subject.total_questions} | 
                        Positive: +{stats.scoredMarks} | 
                        Negative: -{stats.negativeMarks.toFixed(2)} | 
                        Net: {stats.netMarks.toFixed(2)}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-lg font-semibold text-dincharya-text dark:text-white">
                Total Score: {calculateTotalMarks().toFixed(2)} marks
              </div>
              <Button 
                type="submit" 
                disabled={createEnhancedTest.isPending}
                className="bg-dincharya-primary hover:bg-dincharya-secondary"
              >
                {createEnhancedTest.isPending ? "Saving..." : "Save Test Scores"}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedTestEntry;

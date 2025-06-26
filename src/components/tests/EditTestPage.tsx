
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";
import { useEnhancedManualTests } from "@/hooks/use-enhanced-manual-tests";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const EditTestPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: tests } = useEnhancedManualTests();
  
  const test = tests?.find(t => t.id === testId);
  
  const [testName, setTestName] = useState("");
  const [testDate, setTestDate] = useState("");
  const [timeTaken, setTimeTaken] = useState("");
  const [overallPercentage, setOverallPercentage] = useState("");
  const [overallPercentile, setOverallPercentile] = useState("");
  const [subjectData, setSubjectData] = useState<Array<{
    id: string;
    subject_name: string;
    correct_answers: number;
    wrong_answers: number;
    not_attempted: number;
    total_questions: number;
    marks_per_question: number;
  }>>([]);

  useEffect(() => {
    if (test) {
      setTestName(test.test_name);
      setTestDate(test.test_date);
      setTimeTaken(test.time_taken_minutes?.toString() || "");
      setOverallPercentage(test.overall_percentage?.toString() || "");
      setOverallPercentile(test.overall_percentile?.toString() || "");
      
      if (test.subjects) {
        setSubjectData(test.subjects.map(subject => ({
          id: subject.id,
          subject_name: subject.subject_name,
          correct_answers: subject.correct_answers,
          wrong_answers: subject.wrong_answers,
          not_attempted: subject.not_attempted,
          total_questions: subject.total_questions,
          marks_per_question: subject.marks_per_question,
        })));
      }
    }
  }, [test]);

  const updateTestMutation = useMutation({
    mutationFn: async () => {
      if (!test) throw new Error("Test not found");

      // Calculate total marks
      let totalMarks = 0;
      const updatedSubjects = subjectData.map(subject => {
        const scoredMarks = subject.correct_answers * subject.marks_per_question;
        const negativeMarks = subject.wrong_answers * subject.marks_per_question * 0.25; // Assuming 0.25 negative marking
        const netMarks = scoredMarks - negativeMarks;
        totalMarks += netMarks;
        
        return {
          ...subject,
          scored_marks: scoredMarks,
          negative_marks: negativeMarks,
          net_marks: netMarks,
        };
      });

      // Update test entry
      const { error: testError } = await supabase
        .from("manual_test_entries")
        .update({
          test_name: testName,
          test_date: testDate,
          total_marks: totalMarks,
          time_taken_minutes: timeTaken ? parseInt(timeTaken) : null,
          overall_percentage: overallPercentage ? parseFloat(overallPercentage) : null,
          overall_percentile: overallPercentile ? parseFloat(overallPercentile) : null,
        })
        .eq("id", test.id);

      if (testError) throw testError;

      // Update subject scores
      for (const subject of updatedSubjects) {
        const { error: subjectError } = await supabase
          .from("subject_scores")
          .update({
            correct_answers: subject.correct_answers,
            wrong_answers: subject.wrong_answers,
            not_attempted: subject.not_attempted,
            scored_marks: subject.scored_marks,
            negative_marks: subject.negative_marks,
            net_marks: subject.net_marks,
          })
          .eq("id", subject.id);

        if (subjectError) throw subjectError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enhanced-manual-tests"] });
      toast({
        title: "Success",
        description: "Test data updated successfully",
      });
      navigate(`/tests/analysis/${testId}`);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateSubjectField = (index: number, field: string, value: number) => {
    const updatedData = [...subjectData];
    updatedData[index] = { ...updatedData[index], [field]: value };
    
    // Recalculate not_attempted
    if (field === 'correct_answers' || field === 'wrong_answers') {
      const correct = field === 'correct_answers' ? value : updatedData[index].correct_answers;
      const wrong = field === 'wrong_answers' ? value : updatedData[index].wrong_answers;
      updatedData[index].not_attempted = updatedData[index].total_questions - correct - wrong;
    }
    
    setSubjectData(updatedData);
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-dincharya-background to-dincharya-muted/20 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button 
            onClick={() => navigate(`/tests/analysis/${testId}`)}
            variant="outline"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Analysis
          </Button>
          <Button 
            onClick={() => updateTestMutation.mutate()}
            disabled={updateTestMutation.isPending}
            className="bg-dincharya-primary hover:bg-dincharya-primary/90"
          >
            <Save className="h-4 w-4 mr-2" />
            {updateTestMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Edit Test Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="test-name">Test Name</Label>
                <Input
                  id="test-name"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="test-date">Test Date</Label>
                <Input
                  id="test-date"
                  type="date"
                  value={testDate}
                  onChange={(e) => setTestDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="time-taken">Time Taken (minutes)</Label>
                <Input
                  id="time-taken"
                  type="number"
                  value={timeTaken}
                  onChange={(e) => setTimeTaken(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="percentage">Overall Percentage</Label>
                <Input
                  id="percentage"
                  type="number"
                  value={overallPercentage}
                  onChange={(e) => setOverallPercentage(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="percentile">Overall Percentile</Label>
                <Input
                  id="percentile"
                  type="number"
                  value={overallPercentile}
                  onChange={(e) => setOverallPercentile(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Edit Subject Scores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {subjectData.map((subject, index) => (
                <div key={subject.id} className="p-4 border rounded-lg">
                  <h4 className="font-medium text-lg mb-4">{subject.subject_name}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label>Total Questions</Label>
                      <Input
                        type="number"
                        value={subject.total_questions}
                        onChange={(e) => updateSubjectField(index, 'total_questions', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label>Correct Answers</Label>
                      <Input
                        type="number"
                        value={subject.correct_answers}
                        onChange={(e) => updateSubjectField(index, 'correct_answers', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label>Wrong Answers</Label>
                      <Input
                        type="number"
                        value={subject.wrong_answers}
                        onChange={(e) => updateSubjectField(index, 'wrong_answers', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label>Not Attempted</Label>
                      <Input
                        type="number"
                        value={subject.not_attempted}
                        disabled
                        className="bg-gray-100"
                      />
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    Marks per question: {subject.marks_per_question}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditTestPage;

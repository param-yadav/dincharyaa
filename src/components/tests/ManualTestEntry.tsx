
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { useCreateManualTest } from "@/hooks/use-manual-tests";

interface SubjectData {
  subject_name: string;
  correct_answers: number;
  wrong_answers: number;
  not_attempted: number;
  marks_per_question: number;
}

const ManualTestEntry = () => {
  const [testName, setTestName] = useState("");
  const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0]);
  const [subjects, setSubjects] = useState<SubjectData[]>([
    { subject_name: "Reasoning", correct_answers: 0, wrong_answers: 0, not_attempted: 0, marks_per_question: 2 },
    { subject_name: "English", correct_answers: 0, wrong_answers: 0, not_attempted: 0, marks_per_question: 2 },
    { subject_name: "Mathematics", correct_answers: 0, wrong_answers: 0, not_attempted: 0, marks_per_question: 2 },
    { subject_name: "General Knowledge", correct_answers: 0, wrong_answers: 0, not_attempted: 0, marks_per_question: 2 },
  ]);

  const createManualTest = useCreateManualTest();

  const addSubject = () => {
    setSubjects([...subjects, {
      subject_name: "",
      correct_answers: 0,
      wrong_answers: 0,
      not_attempted: 0,
      marks_per_question: 2,
    }]);
  };

  const removeSubject = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const updateSubject = (index: number, field: keyof SubjectData, value: string | number) => {
    const updated = [...subjects];
    updated[index] = { ...updated[index], [field]: value };
    setSubjects(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testName.trim()) {
      return;
    }

    await createManualTest.mutateAsync({
      test_name: testName,
      test_date: testDate,
      subjects: subjects.filter(s => s.subject_name.trim()),
    });

    // Reset form
    setTestName("");
    setTestDate(new Date().toISOString().split('T')[0]);
    setSubjects([
      { subject_name: "Reasoning", correct_answers: 0, wrong_answers: 0, not_attempted: 0, marks_per_question: 2 },
      { subject_name: "English", correct_answers: 0, wrong_answers: 0, not_attempted: 0, marks_per_question: 2 },
      { subject_name: "Mathematics", correct_answers: 0, wrong_answers: 0, not_attempted: 0, marks_per_question: 2 },
      { subject_name: "General Knowledge", correct_answers: 0, wrong_answers: 0, not_attempted: 0, marks_per_question: 2 },
    ]);
  };

  const calculateTotalMarks = () => {
    return subjects.reduce((sum, subject) => {
      return sum + (subject.correct_answers * subject.marks_per_question);
    }, 0);
  };

  return (
    <Card className="bg-white dark:bg-dincharya-text/90 border-dincharya-border/20">
      <CardHeader>
        <CardTitle className="text-dincharya-text dark:text-white">Enter Test Scores Manually</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="testName">Test Name</Label>
              <Input
                id="testName"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                placeholder="e.g., SSC CGL Mock Test 1"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="testDate">Test Date</Label>
              <Input
                id="testDate"
                type="date"
                value={testDate}
                onChange={(e) => setTestDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-dincharya-text dark:text-white">Subject-wise Performance</h3>
              <Button type="button" onClick={addSubject} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Subject
              </Button>
            </div>

            {subjects.map((subject, index) => (
              <Card key={index} className="p-4 bg-gray-50 dark:bg-dincharya-text/50">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                  <div className="space-y-2">
                    <Label>Subject Name</Label>
                    <Input
                      value={subject.subject_name}
                      onChange={(e) => updateSubject(index, 'subject_name', e.target.value)}
                      placeholder="Subject name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Correct</Label>
                    <Input
                      type="number"
                      min="0"
                      value={subject.correct_answers}
                      onChange={(e) => updateSubject(index, 'correct_answers', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Wrong</Label>
                    <Input
                      type="number"
                      min="0"
                      value={subject.wrong_answers}
                      onChange={(e) => updateSubject(index, 'wrong_answers', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Not Attempted</Label>
                    <Input
                      type="number"
                      min="0"
                      value={subject.not_attempted}
                      onChange={(e) => updateSubject(index, 'not_attempted', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Marks/Question</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.5"
                      value={subject.marks_per_question}
                      onChange={(e) => updateSubject(index, 'marks_per_question', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeSubject(index)}
                    disabled={subjects.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Total Questions: {subject.correct_answers + subject.wrong_answers + subject.not_attempted} | 
                  Scored: {subject.correct_answers * subject.marks_per_question} marks
                </div>
              </Card>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-lg font-semibold text-dincharya-text dark:text-white">
              Total Score: {calculateTotalMarks()} marks
            </div>
            <Button 
              type="submit" 
              disabled={createManualTest.isPending}
              className="bg-dincharya-primary hover:bg-dincharya-secondary"
            >
              {createManualTest.isPending ? "Saving..." : "Save Test Scores"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ManualTestEntry;

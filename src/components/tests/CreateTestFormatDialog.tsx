
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { useCreateTestFormat } from "@/hooks/use-test-formats";

interface SubjectFormat {
  subject_name: string;
  total_questions: number;
  marks_per_question: number;
  negative_marking_ratio: number;
}

const CreateTestFormatDialog = () => {
  const [open, setOpen] = useState(false);
  const [formatName, setFormatName] = useState("");
  const [description, setDescription] = useState("");
  const [totalTime, setTotalTime] = useState<number | undefined>();
  const [subjects, setSubjects] = useState<SubjectFormat[]>([
    { subject_name: "", total_questions: 25, marks_per_question: 2, negative_marking_ratio: 0.25 }
  ]);

  const createTestFormat = useCreateTestFormat();

  const addSubject = () => {
    setSubjects([...subjects, {
      subject_name: "",
      total_questions: 25,
      marks_per_question: 2,
      negative_marking_ratio: 0.25
    }]);
  };

  const removeSubject = (index: number) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter((_, i) => i !== index));
    }
  };

  const updateSubject = (index: number, field: keyof SubjectFormat, value: string | number) => {
    const updated = [...subjects];
    updated[index] = { ...updated[index], [field]: value };
    setSubjects(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formatName.trim()) return;

    const validSubjects = subjects.filter(s => s.subject_name.trim());
    if (validSubjects.length === 0) return;

    await createTestFormat.mutateAsync({
      format_name: formatName,
      description: description || undefined,
      total_time_minutes: totalTime,
      subjects: validSubjects.map((subject, index) => ({
        ...subject,
        subject_order: index + 1
      }))
    });

    // Reset form
    setFormatName("");
    setDescription("");
    setTotalTime(undefined);
    setSubjects([{ subject_name: "", total_questions: 25, marks_per_question: 2, negative_marking_ratio: 0.25 }]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Create Test Format
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Test Format</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="formatName">Format Name *</Label>
              <Input
                id="formatName"
                value={formatName}
                onChange={(e) => setFormatName(e.target.value)}
                placeholder="e.g., SSC CGL TIER 1"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalTime">Total Time (minutes)</Label>
              <Input
                id="totalTime"
                type="number"
                value={totalTime || ""}
                onChange={(e) => setTotalTime(e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="e.g., 120"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description of this test format"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Subjects</h3>
              <Button type="button" onClick={addSubject} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Subject
              </Button>
            </div>

            {subjects.map((subject, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                  <div className="space-y-2">
                    <Label>Subject Name *</Label>
                    <Input
                      value={subject.subject_name}
                      onChange={(e) => updateSubject(index, 'subject_name', e.target.value)}
                      placeholder="e.g., Mathematics"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Total Questions</Label>
                    <Input
                      type="number"
                      min="1"
                      value={subject.total_questions}
                      onChange={(e) => updateSubject(index, 'total_questions', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Marks per Question</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.25"
                      value={subject.marks_per_question}
                      onChange={(e) => updateSubject(index, 'marks_per_question', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Negative Marking Ratio</Label>
                    <Input
                      type="number"
                      min="0"
                      max="1"
                      step="0.01"
                      value={subject.negative_marking_ratio}
                      onChange={(e) => updateSubject(index, 'negative_marking_ratio', parseFloat(e.target.value) || 0)}
                      placeholder="e.g., 0.25 for -1/4"
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
                <div className="text-sm text-gray-600">
                  Scoring: +{subject.marks_per_question} for correct, -{(subject.marks_per_question * subject.negative_marking_ratio).toFixed(2)} for wrong
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createTestFormat.isPending}>
              {createTestFormat.isPending ? "Creating..." : "Create Format"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTestFormatDialog;

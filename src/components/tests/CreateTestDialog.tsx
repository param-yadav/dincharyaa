
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateTestTemplate } from "@/hooks/use-test-templates";

interface CreateTestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateTestDialog = ({ open, onOpenChange }: CreateTestDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    test_type: "custom" as "daily" | "custom",
    total_questions: 25,
    total_marks: 50,
    time_limit_minutes: 60,
    negative_marking_ratio: 0.25,
  });

  const createTemplate = useCreateTestTemplate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTemplate.mutateAsync(formData);
    onOpenChange(false);
    setFormData({
      name: "",
      description: "",
      test_type: "custom",
      total_questions: 25,
      total_marks: 50,
      time_limit_minutes: 60,
      negative_marking_ratio: 0.25,
    });
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Custom Test</DialogTitle>
          <DialogDescription>
            Create a new test template with custom settings
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Test Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter test name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter test description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="questions">Total Questions</Label>
              <Input
                id="questions"
                type="number"
                value={formData.total_questions}
                onChange={(e) => handleInputChange("total_questions", parseInt(e.target.value))}
                min="1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="marks">Total Marks</Label>
              <Input
                id="marks"
                type="number"
                value={formData.total_marks}
                onChange={(e) => handleInputChange("total_marks", parseInt(e.target.value))}
                min="1"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="time">Time Limit (minutes)</Label>
              <Input
                id="time"
                type="number"
                value={formData.time_limit_minutes}
                onChange={(e) => handleInputChange("time_limit_minutes", parseInt(e.target.value))}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="negative">Negative Marking</Label>
              <Select 
                value={formData.negative_marking_ratio.toString()} 
                onValueChange={(value) => handleInputChange("negative_marking_ratio", parseFloat(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No Negative Marking</SelectItem>
                  <SelectItem value="0.25">-25% (0.25)</SelectItem>
                  <SelectItem value="0.33">-33% (0.33)</SelectItem>
                  <SelectItem value="0.5">-50% (0.5)</SelectItem>
                  <SelectItem value="1">-100% (1.0)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createTemplate.isPending}
              className="bg-dincharya-primary hover:bg-dincharya-secondary"
            >
              {createTemplate.isPending ? "Creating..." : "Create Test"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTestDialog;

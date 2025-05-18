
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { UserPlus, X } from "lucide-react";
import { Task } from "@/hooks/use-tasks";

interface TaskAssignmentProps {
  task?: Task;
  onAssignees: (assignees: string[]) => void;
  onMessage: (message: string) => void;
}

const TaskAssignment: React.FC<TaskAssignmentProps> = ({
  task,
  onAssignees,
  onMessage
}) => {
  const [assigneeInput, setAssigneeInput] = useState("");
  const [assignees, setAssignees] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const handleAddAssignee = () => {
    if (!assigneeInput.trim()) return;
    
    // Validate email format if it's an email
    const isEmail = assigneeInput.includes('@');
    if (isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(assigneeInput)) {
      return; // Invalid email format
    }
    
    // Add to assignees list if not already added
    if (!assignees.includes(assigneeInput)) {
      const newAssignees = [...assignees, assigneeInput];
      setAssignees(newAssignees);
      onAssignees(newAssignees);
    }
    
    // Clear input
    setAssigneeInput("");
  };

  const handleRemoveAssignee = (assignee: string) => {
    const newAssignees = assignees.filter(a => a !== assignee);
    setAssignees(newAssignees);
    onAssignees(newAssignees);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    onMessage(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddAssignee();
    }
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="border-t pt-4">
        <h4 className="text-base font-medium mb-2">Assign Task</h4>
        <p className="text-sm text-muted-foreground mb-4">
          Add team members who should work on this task
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="assignees">Add Assignees (email or username)</Label>
        <div className="flex gap-2">
          <Input
            id="assignees"
            value={assigneeInput}
            onChange={(e) => setAssigneeInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="user@example.com"
            className="flex-1"
          />
          <Button
            type="button"
            onClick={handleAddAssignee}
            variant="outline"
            size="icon"
          >
            <UserPlus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {assignees.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {assignees.map((assignee) => (
            <Badge key={assignee} variant="secondary" className="flex items-center gap-1">
              {assignee}
              <button
                onClick={() => handleRemoveAssignee(assignee)}
                className="ml-1 rounded-full hover:bg-background/20 p-1"
                type="button"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="message">Message (optional)</Label>
        <Textarea
          id="message"
          value={message}
          onChange={handleMessageChange}
          placeholder="Add a note to the assignees..."
          className="min-h-24"
        />
      </div>
    </div>
  );
};

export default TaskAssignment;

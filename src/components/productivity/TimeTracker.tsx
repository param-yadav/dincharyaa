import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Play, Pause, Square, Clock, Target } from "lucide-react";
import { useProductivity, ProductivityCategory } from "@/hooks/use-productivity";
import { formatDistanceToNow } from "date-fns";

const TimeTracker = () => {
  const { 
    timeEntries, 
    currentEntry, 
    startTimeEntry, 
    stopTimeEntry, 
    goals
  } = useProductivity();

  const [newEntry, setNewEntry] = useState({
    title: "",
    category: "work" as ProductivityCategory,
    description: "",
    task_id: "",
    goal_id: ""
  });

  const [elapsedTime, setElapsedTime] = useState(0);

  // Update elapsed time for current entry
  useEffect(() => {
    if (currentEntry) {
      const interval = setInterval(() => {
        const startTime = new Date(currentEntry.start_time);
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000 / 60);
        setElapsedTime(elapsed);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [currentEntry]);

  const handleStart = async () => {
    if (!newEntry.title.trim()) return;

    await startTimeEntry({
      title: newEntry.title,
      category: newEntry.category,
      description: newEntry.description || undefined,
      task_id: newEntry.task_id || undefined,
      goal_id: newEntry.goal_id || undefined
    });

    setNewEntry({
      title: "",
      category: "work",
      description: "",
      task_id: "",
      goal_id: ""
    });
  };

  const handleStop = async () => {
    if (!currentEntry) return;
    await stopTimeEntry(currentEntry.id);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const categoryColors: Record<ProductivityCategory, string> = {
    work: "bg-blue-500",
    study: "bg-green-500", 
    exercise: "bg-red-500",
    personal: "bg-purple-500",
    break: "bg-gray-500",
    meeting: "bg-yellow-500",
    project: "bg-indigo-500"
  };

  const getCategoryColor = (category: ProductivityCategory) => {
    return categoryColors[category] || "bg-gray-500";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Active Timer */}
      <Card className="lg:col-span-2 bg-white/50 dark:bg-dincharya-text/20 border-dincharya-muted/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Time Tracker
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentEntry ? (
            <div className="text-center space-y-4">
              <div className="text-6xl font-bold text-dincharya-primary">
                {formatTime(elapsedTime)}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{currentEntry.title}</h3>
                <Badge className={`${getCategoryColor(currentEntry.category)} text-white`}>
                  {currentEntry.category}
                </Badge>
                {currentEntry.description && (
                  <p className="text-dincharya-muted">{currentEntry.description}</p>
                )}
              </div>
              <Button onClick={handleStop} size="lg" variant="destructive" className="w-32">
                <Square className="w-4 h-4 mr-2" />
                Stop
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Activity Title</label>
                  <Input
                    placeholder="What are you working on?"
                    value={newEntry.title}
                    onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={newEntry.category} onValueChange={(value: ProductivityCategory) => 
                    setNewEntry({ ...newEntry, category: value })
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="work">Work</SelectItem>
                      <SelectItem value="study">Study</SelectItem>
                      <SelectItem value="exercise">Exercise</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                      <SelectItem value="break">Break</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description (Optional)</label>
                <Textarea
                  placeholder="Add any additional details..."
                  value={newEntry.description}
                  onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Link to Goal (Optional)</label>
                  <Select value={newEntry.goal_id} onValueChange={(value) => 
                    setNewEntry({ ...newEntry, goal_id: value })
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {goals.map((goal) => (
                        <SelectItem key={goal.id} value={goal.id}>
                          {goal.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Link to Task (Optional)</label>
                  <Select value={newEntry.task_id} onValueChange={(value) => 
                    setNewEntry({ ...newEntry, task_id: value })
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a task" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {/* Tasks will be populated from tasks hook */}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleStart} 
                size="lg" 
                className="w-full" 
                disabled={!newEntry.title.trim()}
              >
                <Play className="w-4 h-4 mr-2" />
                Start Tracking
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Entries */}
      <Card className="bg-white/50 dark:bg-dincharya-text/20 border-dincharya-muted/20">
        <CardHeader>
          <CardTitle>Recent Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {timeEntries.slice(0, 5).map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-3 rounded-lg bg-white/30 dark:bg-dincharya-text/10">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${getCategoryColor(entry.category)}`} />
                    <p className="text-sm font-medium truncate">{entry.title}</p>
                  </div>
                  <p className="text-xs text-dincharya-muted">
                    {entry.duration_minutes ? formatTime(entry.duration_minutes) : "In progress"}
                  </p>
                </div>
                <div className="text-xs text-dincharya-muted">
                  {formatDistanceToNow(new Date(entry.start_time), { addSuffix: true })}
                </div>
              </div>
            ))}
            {timeEntries.length === 0 && (
              <p className="text-center text-dincharya-muted py-8">
                No time entries yet. Start tracking your first activity!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeTracker;
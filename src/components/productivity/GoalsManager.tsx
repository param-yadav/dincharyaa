import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Target, Plus, Calendar, TrendingUp } from "lucide-react";
import { useProductivity, ProductivityCategory, PriorityLevel } from "@/hooks/use-productivity";

const GoalsManager = () => {
  const { goals, createGoal, updateGoalProgress } = useProductivity();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    category: "work" as ProductivityCategory,
    priority: "medium" as PriorityLevel,
    target_value: 100,
    target_date: ""
  });

  const handleCreateGoal = async () => {
    if (!newGoal.title.trim()) return;

    await createGoal({
      title: newGoal.title,
      description: newGoal.description || undefined,
      category: newGoal.category,
      priority: newGoal.priority,
      target_value: newGoal.target_value,
      target_date: newGoal.target_date || undefined,
      status: "pending"
    });

    setNewGoal({
      title: "",
      description: "",
      category: "work",
      priority: "medium",
      target_value: 100,
      target_date: ""
    });

    setShowCreateDialog(false);
  };

  const getProgressPercentage = (goal: any) => {
    if (!goal.target_value) return 0;
    return Math.min((goal.current_value / goal.target_value) * 100, 100);
  };

  const getPriorityColor = (priority: PriorityLevel) => {
    const colors = {
      low: "bg-green-500",
      medium: "bg-yellow-500", 
      high: "bg-orange-500",
      urgent: "bg-red-500"
    };
    return colors[priority];
  };

  const getCategoryColor = (category: ProductivityCategory) => {
    const colors = {
      work: "bg-blue-500",
      study: "bg-green-500",
      exercise: "bg-red-500", 
      personal: "bg-purple-500",
      break: "bg-gray-500",
      meeting: "bg-yellow-500",
      project: "bg-indigo-500"
    };
    return colors[category];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-dincharya-text dark:text-white">Goals</h2>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Goal Title</label>
                <Input
                  placeholder="What do you want to achieve?"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Describe your goal..."
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={newGoal.category} onValueChange={(value: ProductivityCategory) => 
                    setNewGoal({ ...newGoal, category: value })
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="work">Work</SelectItem>
                      <SelectItem value="study">Study</SelectItem>
                      <SelectItem value="exercise">Exercise</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <Select value={newGoal.priority} onValueChange={(value: PriorityLevel) => 
                    setNewGoal({ ...newGoal, priority: value })
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Value</label>
                  <Input
                    type="number"
                    placeholder="100"
                    value={newGoal.target_value}
                    onChange={(e) => setNewGoal({ ...newGoal, target_value: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Date</label>
                  <Input
                    type="date"
                    value={newGoal.target_date}
                    onChange={(e) => setNewGoal({ ...newGoal, target_date: e.target.value })}
                  />
                </div>
              </div>

              <Button onClick={handleCreateGoal} className="w-full" disabled={!newGoal.title.trim()}>
                Create Goal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => (
          <Card key={goal.id} className="bg-white/50 dark:bg-dincharya-text/20 border-dincharya-muted/20">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg leading-tight">{goal.title}</CardTitle>
                <div className="flex gap-1">
                  <Badge className={`${getPriorityColor(goal.priority)} text-white text-xs`}>
                    {goal.priority}
                  </Badge>
                  <Badge className={`${getCategoryColor(goal.category)} text-white text-xs`}>
                    {goal.category}
                  </Badge>
                </div>
              </div>
              {goal.description && (
                <p className="text-sm text-dincharya-muted">{goal.description}</p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>
                    {goal.current_value} / {goal.target_value || 0}
                  </span>
                </div>
                <Progress value={getProgressPercentage(goal)} className="h-2" />
                <div className="text-xs text-dincharya-muted">
                  {Math.round(getProgressPercentage(goal))}% complete
                </div>
              </div>

              {goal.target_date && (
                <div className="flex items-center gap-2 text-sm text-dincharya-muted">
                  <Calendar className="w-4 h-4" />
                  Due: {new Date(goal.target_date).toLocaleDateString()}
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => updateGoalProgress(goal.id, goal.current_value + 1)}
                  className="flex-1"
                >
                  +1
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => updateGoalProgress(goal.id, goal.current_value + 5)}
                  className="flex-1"
                >
                  +5
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => updateGoalProgress(goal.id, goal.current_value + 10)}
                  className="flex-1"
                >
                  +10
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {goals.length === 0 && (
          <div className="col-span-full">
            <Card className="bg-white/50 dark:bg-dincharya-text/20 border-dincharya-muted/20">
              <CardContent className="py-12 text-center">
                <Target className="h-12 w-12 mx-auto text-dincharya-muted mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Goals Yet</h3>
                <p className="text-dincharya-muted mb-4">
                  Set your first goal to start tracking your progress
                </p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Goal
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalsManager;
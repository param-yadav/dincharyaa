import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle2, Plus, Calendar, Flame, Target } from "lucide-react";
import { useHabits } from "@/hooks/use-habits";
import { ProductivityCategory } from "@/hooks/use-productivity";

const HabitsTracker = () => {
  const { habits, habitLogs, createHabit, logHabit, getHabitStreak, getTodaysProgress } = useHabits();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: "",
    description: "",
    category: "personal" as ProductivityCategory,
    target_frequency: "daily",
    target_count: 1,
    reminder_time: ""
  });

  const todaysProgress = getTodaysProgress();

  const handleCreateHabit = async () => {
    if (!newHabit.name.trim()) return;

    await createHabit({
      name: newHabit.name,
      description: newHabit.description || undefined,
      category: newHabit.category,
      target_frequency: newHabit.target_frequency,
      target_count: newHabit.target_count,
      reminder_time: newHabit.reminder_time || undefined,
      is_active: true
    });

    setNewHabit({
      name: "",
      description: "",
      category: "personal",
      target_frequency: "daily",
      target_count: 1,
      reminder_time: ""
    });

    setShowCreateDialog(false);
  };

  const handleLogHabit = async (habitId: string) => {
    await logHabit(habitId, 1);
  };

  const isCompletedToday = (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    return habitLogs.some(log => 
      log.habit_id === habitId && 
      log.date === today && 
      log.completed
    );
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
        <h2 className="text-2xl font-semibold text-dincharya-text dark:text-white">Habits</h2>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Habit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Habit</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Habit Name</label>
                <Input
                  placeholder="What habit do you want to build?"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Describe your habit..."
                  value={newHabit.description}
                  onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={newHabit.category} onValueChange={(value: ProductivityCategory) => 
                    setNewHabit({ ...newHabit, category: value })
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="exercise">Exercise</SelectItem>
                      <SelectItem value="study">Study</SelectItem>
                      <SelectItem value="work">Work</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Frequency</label>
                  <Select value={newHabit.target_frequency} onValueChange={(value) => 
                    setNewHabit({ ...newHabit, target_frequency: value })
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Count</label>
                  <Input
                    type="number"
                    placeholder="1"
                    min="1"
                    value={newHabit.target_count}
                    onChange={(e) => setNewHabit({ ...newHabit, target_count: parseInt(e.target.value) || 1 })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Reminder Time</label>
                  <Input
                    type="time"
                    value={newHabit.reminder_time}
                    onChange={(e) => setNewHabit({ ...newHabit, reminder_time: e.target.value })}
                  />
                </div>
              </div>

              <Button onClick={handleCreateHabit} className="w-full" disabled={!newHabit.name.trim()}>
                Create Habit
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Progress Overview */}
      <Card className="bg-white/50 dark:bg-dincharya-text/20 border-dincharya-muted/20">
        <CardHeader>
          <CardTitle>Today's Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600">{todaysProgress.completed}</div>
              <div className="text-sm text-dincharya-muted">Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-dincharya-primary">{todaysProgress.total}</div>
              <div className="text-sm text-dincharya-muted">Total Habits</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-dincharya-secondary">
                {Math.round(todaysProgress.percentage)}%
              </div>
              <div className="text-sm text-dincharya-muted">Completion</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Habits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {habits.map((habit) => {
          const streak = getHabitStreak(habit.id);
          const completedToday = isCompletedToday(habit.id);

          return (
            <Card key={habit.id} className="bg-white/50 dark:bg-dincharya-text/20 border-dincharya-muted/20">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg leading-tight">{habit.name}</CardTitle>
                  <Badge className={`${getCategoryColor(habit.category)} text-white text-xs`}>
                    {habit.category}
                  </Badge>
                </div>
                {habit.description && (
                  <p className="text-sm text-dincharya-muted">{habit.description}</p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium">{streak} day streak</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-dincharya-primary" />
                    <span className="text-sm">{habit.target_frequency}</span>
                  </div>
                </div>

                {habit.reminder_time && (
                  <div className="flex items-center gap-2 text-sm text-dincharya-muted">
                    <Calendar className="w-4 h-4" />
                    Reminder: {habit.reminder_time}
                  </div>
                )}

                <Button
                  onClick={() => handleLogHabit(habit.id)}
                  disabled={completedToday}
                  className={`w-full ${completedToday ? 'bg-green-600 hover:bg-green-600' : ''}`}
                  variant={completedToday ? "default" : "outline"}
                >
                  {completedToday ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Completed Today
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Mark as Done
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}

        {habits.length === 0 && (
          <div className="col-span-full">
            <Card className="bg-white/50 dark:bg-dincharya-text/20 border-dincharya-muted/20">
              <CardContent className="py-12 text-center">
                <CheckCircle2 className="h-12 w-12 mx-auto text-dincharya-muted mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Habits Yet</h3>
                <p className="text-dincharya-muted mb-4">
                  Create your first habit to start building positive routines
                </p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Habit
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitsTracker;
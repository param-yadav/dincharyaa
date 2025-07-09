import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Plus, Clock, Play, CheckCircle2, MoreHorizontal } from "lucide-react";
import { useRoutines } from "@/hooks/use-routines";
import { ProductivityCategory } from "@/hooks/use-productivity";

const RoutinesManager = () => {
  const { 
    templates, 
    routineItems, 
    createTemplate, 
    addRoutineItem, 
    startDailyRoutine, 
    getTodaysRoutine, 
    getRoutineItems 
  } = useRoutines();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showItemDialog, setShowItemDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    is_active: true
  });

  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    category: "work" as ProductivityCategory,
    start_time: "09:00",
    duration_minutes: 30,
    is_mandatory: true,
    order_index: 1
  });

  const handleCreateTemplate = async () => {
    if (!newTemplate.name.trim()) return;

    await createTemplate(newTemplate);
    setNewTemplate({
      name: "",
      description: "",
      is_active: true
    });
    setShowCreateDialog(false);
  };

  const handleAddItem = async () => {
    if (!newItem.title.trim() || !selectedTemplate) return;

    const existingItems = getRoutineItems(selectedTemplate);
    const nextOrder = Math.max(...existingItems.map(item => item.order_index), 0) + 1;

    await addRoutineItem({
      template_id: selectedTemplate,
      title: newItem.title,
      description: newItem.description || undefined,
      category: newItem.category,
      start_time: newItem.start_time,
      duration_minutes: newItem.duration_minutes,
      is_mandatory: newItem.is_mandatory,
      order_index: nextOrder
    });

    setNewItem({
      title: "",
      description: "",
      category: "work",
      start_time: "09:00",
      duration_minutes: 30,
      is_mandatory: true,
      order_index: 1
    });
    setShowItemDialog(false);
  };

  const handleStartRoutine = async (templateId: string) => {
    await startDailyRoutine(templateId);
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
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
        <h2 className="text-2xl font-semibold text-dincharya-text dark:text-white">Routines</h2>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Routine
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Routine</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Routine Name</label>
                <Input
                  placeholder="e.g., Morning Routine"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Describe your routine..."
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                  rows={3}
                />
              </div>

              <Button onClick={handleCreateTemplate} className="w-full" disabled={!newTemplate.name.trim()}>
                Create Routine
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {templates.map((template) => {
          const items = getRoutineItems(template.id);
          const todaysRoutine = getTodaysRoutine(template.id);
          const totalDuration = items.reduce((sum, item) => sum + item.duration_minutes, 0);

          return (
            <Card key={template.id} className="bg-white/50 dark:bg-dincharya-text/20 border-dincharya-muted/20">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    {template.description && (
                      <p className="text-sm text-dincharya-muted mt-1">{template.description}</p>
                    )}
                  </div>
                  <Badge variant="outline">
                    {items.length} steps
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-dincharya-muted" />
                      <span>{Math.floor(totalDuration / 60)}h {totalDuration % 60}m</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-dincharya-muted" />
                      <span>{todaysRoutine ? "Started" : "Not started"}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">Routine Steps</h4>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedTemplate(template.id);
                        setShowItemDialog(true);
                      }}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Step
                    </Button>
                  </div>
                  
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {items.length > 0 ? (
                      items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-2 rounded bg-white/30 dark:bg-dincharya-text/10">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getCategoryColor(item.category)}`} />
                            <span className="text-sm font-medium">{item.title}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-dincharya-muted">
                            <span>{formatTime(item.start_time)}</span>
                            <span>{item.duration_minutes}m</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-dincharya-muted py-4 text-center">
                        No steps added yet
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  {!todaysRoutine ? (
                    <Button 
                      onClick={() => handleStartRoutine(template.id)}
                      className="flex-1"
                      disabled={items.length === 0}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Today
                    </Button>
                  ) : (
                    <Button variant="outline" className="flex-1" disabled>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Started Today
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {templates.length === 0 && (
          <div className="col-span-full">
            <Card className="bg-white/50 dark:bg-dincharya-text/20 border-dincharya-muted/20">
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 mx-auto text-dincharya-muted mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Routines Yet</h3>
                <p className="text-dincharya-muted mb-4">
                  Create your first routine to structure your day
                </p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Routine
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Add Item Dialog */}
      <Dialog open={showItemDialog} onOpenChange={setShowItemDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Routine Step</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Step Title</label>
              <Input
                placeholder="e.g., Meditation"
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Optional description..."
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={newItem.category} onValueChange={(value: ProductivityCategory) => 
                  setNewItem({ ...newItem, category: value })
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="study">Study</SelectItem>
                    <SelectItem value="exercise">Exercise</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="break">Break</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Start Time</label>
                <Input
                  type="time"
                  value={newItem.start_time}
                  onChange={(e) => setNewItem({ ...newItem, start_time: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Duration (minutes)</label>
              <Input
                type="number"
                placeholder="30"
                min="1"
                value={newItem.duration_minutes}
                onChange={(e) => setNewItem({ ...newItem, duration_minutes: parseInt(e.target.value) || 30 })}
              />
            </div>

            <Button onClick={handleAddItem} className="w-full" disabled={!newItem.title.trim()}>
              Add Step
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoutinesManager;

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

interface ScheduleEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
}

const SchedulerPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [scheduleTitle, setScheduleTitle] = useState("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [schedules, setSchedules] = useState<ScheduleEvent[]>([]);

  const handleCreateSchedule = () => {
    if (!scheduleTitle) {
      toast({
        title: "Title required",
        description: "Please enter a title for your schedule",
        variant: "destructive",
      });
      return;
    }

    if (endDate < startDate) {
      toast({
        title: "Invalid date range",
        description: "End date must be after start date",
        variant: "destructive",
      });
      return;
    }

    const newSchedule: ScheduleEvent = {
      id: `schedule-${Date.now()}`,
      title: scheduleTitle,
      start: startDate,
      end: endDate,
    };

    setSchedules([...schedules, newSchedule]);
    
    toast({
      title: "Schedule created",
      description: "Your schedule has been created successfully",
    });
    
    setScheduleTitle("");
  };

  // Filter events for the selected date
  const eventsForSelectedDate = schedules.filter(
    (schedule) => 
      selectedDate.getDate() >= new Date(schedule.start).getDate() && 
      selectedDate.getDate() <= new Date(schedule.end).getDate() &&
      selectedDate.getMonth() >= new Date(schedule.start).getMonth() && 
      selectedDate.getMonth() <= new Date(schedule.end).getMonth() &&
      selectedDate.getFullYear() >= new Date(schedule.start).getFullYear() && 
      selectedDate.getFullYear() <= new Date(schedule.end).getFullYear()
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-dincharya-text dark:text-white mb-6">Scheduler</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calendar Section */}
        <Card className="md:col-span-1 bg-white dark:bg-dincharya-text/80 rounded-lg overflow-hidden shadow">
          <CardHeader>
            <CardTitle>Date Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
        
        {/* Schedule Creation Section */}
        <Card className="md:col-span-2 bg-white dark:bg-dincharya-text/80 rounded-lg overflow-hidden shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              Schedules for {format(selectedDate, "MMMM d, yyyy")}
            </CardTitle>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" /> Create Schedule
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Schedule</DialogTitle>
                  <DialogDescription>
                    Set up a new schedule to manage multiple tasks
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Schedule title"
                      value={scheduleTitle}
                      onChange={(e) => setScheduleTitle(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="start-date">Start Date</Label>
                      <div className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                        <span className="text-muted-foreground">
                          {format(startDate, "MMM dd, yyyy")}
                        </span>
                        <CalendarIcon className="h-4 w-4 opacity-50" />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="end-date">End Date</Label>
                      <div className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                        <span className="text-muted-foreground">
                          {format(endDate, "MMM dd, yyyy")}
                        </span>
                        <CalendarIcon className="h-4 w-4 opacity-50" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label>Date Range</Label>
                    <Calendar
                      mode="range"
                      defaultMonth={startDate}
                      selected={{
                        from: startDate,
                        to: endDate,
                      }}
                      onSelect={(range) => {
                        if (range?.from) setStartDate(range.from);
                        if (range?.to) setEndDate(range.to);
                      }}
                      numberOfMonths={2}
                      className="rounded-md border"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateSchedule}>Create Schedule</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          
          <CardContent>
            {eventsForSelectedDate.length > 0 ? (
              <div className="space-y-4">
                {eventsForSelectedDate.map((event) => (
                  <div key={event.id} className="flex items-center p-3 rounded-lg bg-muted/30">
                    <div className="flex-1">
                      <h4 className="text-base font-medium">{event.title}</h4>
                      <div className="text-sm text-muted-foreground mt-1">
                        {format(new Date(event.start), "MMM d, yyyy")} - {format(new Date(event.end), "MMM d, yyyy")}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="rounded-full bg-muted p-6 mb-4">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No schedules found</h3>
                <p className="text-muted-foreground mb-4">
                  Create a new schedule to begin planning
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> Create Schedule
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Create New Schedule</DialogTitle>
                      <DialogDescription>
                        Set up a new schedule to manage multiple tasks
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          placeholder="Schedule title"
                          value={scheduleTitle}
                          onChange={(e) => setScheduleTitle(e.target.value)}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="start-date">Start Date</Label>
                          <div className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                            <span className="text-muted-foreground">
                              {format(startDate, "MMM dd, yyyy")}
                            </span>
                            <CalendarIcon className="h-4 w-4 opacity-50" />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="end-date">End Date</Label>
                          <div className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                            <span className="text-muted-foreground">
                              {format(endDate, "MMM dd, yyyy")}
                            </span>
                            <CalendarIcon className="h-4 w-4 opacity-50" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label>Date Range</Label>
                        <Calendar
                          mode="range"
                          defaultMonth={startDate}
                          selected={{
                            from: startDate,
                            to: endDate,
                          }}
                          onSelect={(range) => {
                            if (range?.from) setStartDate(range.from);
                            if (range?.to) setEndDate(range.to);
                          }}
                          numberOfMonths={2}
                          className="rounded-md border"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleCreateSchedule}>Create Schedule</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SchedulerPage;

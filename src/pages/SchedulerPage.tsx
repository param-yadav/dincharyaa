
import { useState, useEffect } from "react";
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
import { Plus, Calendar as CalendarIcon, Clock } from "lucide-react";
import { format, isSameDay, addDays, addHours, setHours, setMinutes } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

interface ScheduleEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  isAllDay?: boolean;
}

// Define Schedule interface to match with the schedules table
interface Schedule {
  id: string;
  title: string;
  date_from: string;
  date_to: string;
  is_all_day: boolean;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

const SchedulerPage = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [scheduleTitle, setScheduleTitle] = useState("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 1));
  const [schedules, setSchedules] = useState<ScheduleEvent[]>([]);
  const [isAllDay, setIsAllDay] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [recurringType, setRecurringType] = useState("none");
  const [recurringDays, setRecurringDays] = useState<string[]>([]);

  // Fetch schedules from Supabase when component mounts
  useEffect(() => {
    const fetchSchedules = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('schedules')
          .select('*')
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        if (data) {
          setSchedules(data.map((item: Schedule) => ({
            id: item.id,
            title: item.title,
            start: new Date(item.date_from),
            end: new Date(item.date_to),
            isAllDay: item.is_all_day || false
          })));
        }
      } catch (error) {
        console.error('Error fetching schedules:', error);
        toast({
          title: "Failed to load schedules",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSchedules();
  }, [user]);

  const handleCreateSchedule = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create schedules",
        variant: "destructive",
      });
      return;
    }
    
    if (!scheduleTitle) {
      toast({
        title: "Title required",
        description: "Please enter a title for your schedule",
        variant: "destructive",
      });
      return;
    }

    try {
      // Parse times
      let finalStartDate = new Date(startDate);
      let finalEndDate = new Date(endDate);
      
      if (!isAllDay) {
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const [endHours, endMinutes] = endTime.split(':').map(Number);
        
        finalStartDate = setMinutes(setHours(finalStartDate, startHours), startMinutes);
        finalEndDate = setMinutes(setHours(finalEndDate, endHours), endMinutes);
      }
      
      if (finalEndDate < finalStartDate) {
        toast({
          title: "Invalid date range",
          description: "End date must be after start date",
          variant: "destructive",
        });
        return;
      }

      // For recurring schedules, create multiple entries
      if (recurringType !== 'none' && recurringDays.length > 0) {
        // Handle recurring schedules
        const daysMap: Record<string, number> = {
          "sunday": 0, "monday": 1, "tuesday": 2, "wednesday": 3, 
          "thursday": 4, "friday": 5, "saturday": 6
        };
        
        for (const day of recurringDays) {
          const dayNumber = daysMap[day];
          // Create schedules for the next 4 weeks
          for (let i = 0; i < 4; i++) {
            const currentDate = new Date();
            // Find the next occurrence of this day
            const daysToAdd = (dayNumber + 7 - currentDate.getDay()) % 7 + (i * 7);
            const scheduleDate = addDays(new Date(), daysToAdd);
            
            // Set time from the form
            let scheduleStart = scheduleDate;
            let scheduleEnd = scheduleDate;
            
            if (!isAllDay) {
              const [startHours, startMinutes] = startTime.split(':').map(Number);
              const [endHours, endMinutes] = endTime.split(':').map(Number);
              
              scheduleStart = setMinutes(setHours(scheduleStart, startHours), startMinutes);
              scheduleEnd = setMinutes(setHours(scheduleEnd, endHours), endMinutes);
            } else {
              // For all-day events, end at end of day
              scheduleEnd = addHours(scheduleEnd, 23);
              scheduleEnd = setMinutes(scheduleEnd, 59);
            }
            
            const newSchedule: Schedule = {
              id: '', // This will be auto-generated by Supabase
              title: `${scheduleTitle} (${day.charAt(0).toUpperCase() + day.slice(1)})`,
              date_from: scheduleStart.toISOString(),
              date_to: scheduleEnd.toISOString(),
              is_all_day: isAllDay,
              user_id: user.id
            };
            
            await supabase.from('schedules').insert(newSchedule);
          }
        }
        
        toast({
          title: "Recurring schedule created",
          description: "Your recurring schedule has been created for the next 4 weeks",
        });
      } else {
        // Single schedule
        const newSchedule: Schedule = {
          id: '', // This will be auto-generated by Supabase
          title: scheduleTitle,
          date_from: finalStartDate.toISOString(),
          date_to: finalEndDate.toISOString(),
          is_all_day: isAllDay,
          user_id: user.id
        };
  
        const { data, error } = await supabase
          .from('schedules')
          .insert(newSchedule)
          .select()
          .single();
  
        if (error) throw error;
        
        // Add to local state
        const addedSchedule: ScheduleEvent = {
          id: data.id,
          title: data.title,
          start: new Date(data.date_from),
          end: new Date(data.date_to),
          isAllDay: data.is_all_day || false
        };
        
        setSchedules([...schedules, addedSchedule]);
        
        toast({
          title: "Schedule created",
          description: "Your schedule has been created successfully",
        });
        
        // Create tasks for each day in the schedule if it's multi-day
        if (!isSameDay(finalStartDate, finalEndDate)) {
          try {
            // Use type assertion to work around TypeScript limitations
            // This allows us to call the RPC function without modifying the types file
            const { error: tasksError } = await (supabase.rpc as any)(
              'create_tasks_from_schedule',
              { 
                schedule_id: data.id,
                schedule_title: data.title
              }
            );
            
            if (tasksError) {
              console.error('Error creating tasks from schedule:', tasksError);
            } else {
              toast({
                title: "Tasks created",
                description: "Tasks have been created for each day in the schedule",
              });
            }
          } catch (err) {
            console.error("Failed to call create_tasks_from_schedule function:", err);
          }
        }
      }
      
      setScheduleTitle("");
      setIsAllDay(false);
      setRecurringType("none");
      setRecurringDays([]);
      setDialogOpen(false);
      
      // Refresh schedules
      const { data: refreshedData } = await supabase
        .from('schedules')
        .select('*')
        .eq('user_id', user.id);
        
      if (refreshedData) {
        setSchedules(refreshedData.map((item: Schedule) => ({
          id: item.id,
          title: item.title,
          start: new Date(item.date_from),
          end: new Date(item.date_to),
          isAllDay: item.is_all_day || false
        })));
      }
    } catch (error) {
      console.error('Error creating schedule:', error);
      toast({
        title: "Failed to create schedule",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  // Helper function to toggle recurring days
  const toggleRecurringDay = (day: string) => {
    if (recurringDays.includes(day)) {
      setRecurringDays(recurringDays.filter(d => d !== day));
    } else {
      setRecurringDays([...recurringDays, day]);
    }
  };

  // Filter events for the selected date
  const eventsForSelectedDate = schedules.filter(
    (schedule) => 
      (isSameDay(selectedDate, new Date(schedule.start)) || 
       isSameDay(selectedDate, new Date(schedule.end)) ||
       (selectedDate >= new Date(schedule.start) && selectedDate <= new Date(schedule.end)))
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
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                  <Plus className="mr-2 h-4 w-4" /> Create Schedule
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] bg-amber-50 border-amber-200">
                <DialogHeader>
                  <DialogTitle className="text-xl">Create New Schedule</DialogTitle>
                  <DialogDescription>
                    Set up a new schedule to manage multiple tasks
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                  <div className="grid gap-2">
                    <Label htmlFor="title" className="text-base font-medium">Title</Label>
                    <Input
                      id="title"
                      placeholder="Schedule title"
                      value={scheduleTitle}
                      onChange={(e) => setScheduleTitle(e.target.value)}
                      className="border-amber-300 bg-white"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="allday"
                      checked={isAllDay}
                      onChange={() => setIsAllDay(!isAllDay)}
                      className="h-4 w-4 rounded border-amber-300 text-amber-600"
                    />
                    <Label htmlFor="allday" className="font-medium">All-day schedule</Label>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="start-date" className="text-base font-medium">Start Date</Label>
                      <div className="flex h-10 items-center justify-between rounded-md border border-amber-300 bg-white px-3 py-2 text-sm">
                        <span>
                          {format(startDate, "MMM dd, yyyy")}
                        </span>
                        <CalendarIcon className="h-4 w-4 opacity-50" />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="end-date" className="text-base font-medium">End Date</Label>
                      <div className="flex h-10 items-center justify-between rounded-md border border-amber-300 bg-white px-3 py-2 text-sm">
                        <span>
                          {format(endDate, "MMM dd, yyyy")}
                        </span>
                        <CalendarIcon className="h-4 w-4 opacity-50" />
                      </div>
                    </div>
                  </div>
                  
                  {!isAllDay && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="start-time" className="text-base font-medium">Start Time</Label>
                        <div className="flex items-center">
                          <Input
                            id="start-time"
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="border-amber-300 bg-white"
                          />
                          <Clock className="h-5 w-5 ml-2 text-amber-600" />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="end-time" className="text-base font-medium">End Time</Label>
                        <div className="flex items-center">
                          <Input
                            id="end-time"
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="border-amber-300 bg-white"
                          />
                          <Clock className="h-5 w-5 ml-2 text-amber-600" />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid gap-2">
                    <Label className="text-base font-medium">Recurring Schedule</Label>
                    <select 
                      className="border border-amber-300 rounded-md p-2 bg-white"
                      value={recurringType}
                      onChange={(e) => setRecurringType(e.target.value)}
                    >
                      <option value="none">Not recurring</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  
                  {recurringType === 'weekly' && (
                    <div className="grid gap-2">
                      <Label className="text-base font-medium">Repeat on days</Label>
                      <div className="flex flex-wrap gap-2">
                        {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                          <Button 
                            key={day}
                            type="button"
                            variant={recurringDays.includes(day) ? "default" : "outline"}
                            className={recurringDays.includes(day) ? "bg-amber-600" : "border-amber-300 hover:bg-amber-100"}
                            onClick={() => toggleRecurringDay(day)}
                          >
                            {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="grid gap-2">
                    <Label className="text-base font-medium">Date Range</Label>
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
                      className="rounded-md border pointer-events-auto bg-white p-2"
                    />
                  </div>
                  
                  <div className="text-sm text-amber-700 bg-amber-100 p-3 rounded-md">
                    <p><strong>Note:</strong> For multi-day schedules, individual tasks will be automatically created for each day.</p>
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => setDialogOpen(false)}
                    className="border-amber-300 text-amber-700"
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="bg-amber-600 hover:bg-amber-700" 
                    onClick={handleCreateSchedule}
                  >
                    Create Schedule
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-12">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-amber-200 mb-4"></div>
                  <div className="h-4 w-32 bg-amber-100 rounded mb-2"></div>
                  <div className="h-3 w-24 bg-amber-50 rounded"></div>
                </div>
              </div>
            ) : eventsForSelectedDate.length > 0 ? (
              <div className="space-y-4">
                {eventsForSelectedDate.map((event) => (
                  <div key={event.id} className="flex items-center p-4 rounded-lg bg-amber-50 border border-amber-200">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h4 className="text-base font-medium">{event.title}</h4>
                        {event.isAllDay && (
                          <span className="ml-2 px-2 py-0.5 text-xs bg-amber-100 text-amber-800 rounded-full">
                            All day
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {format(new Date(event.start), "MMM d, yyyy")}
                        {!isAllDay && format(new Date(event.start), ", h:mm a")}
                        {!isSameDay(new Date(event.start), new Date(event.end)) && 
                          ` - ${format(new Date(event.end), "MMM d, yyyy")}`}
                        {!isAllDay && !isSameDay(new Date(event.start), new Date(event.end)) && 
                          format(new Date(event.end), ", h:mm a")}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="border-amber-300 hover:bg-amber-100">View</Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="rounded-full bg-amber-100 p-6 mb-4">
                  <Calendar className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-lg font-medium mb-1">No schedules found</h3>
                <p className="text-muted-foreground mb-4">
                  Create a new schedule to begin planning
                </p>
                <Button 
                  className="bg-amber-600 hover:bg-amber-700"
                  onClick={() => setDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" /> Create Schedule
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SchedulerPage;

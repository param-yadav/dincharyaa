
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Calendar as CalendarIcon, Clock, Edit, Trash2 } from "lucide-react";
import { format, isSameDay, addHours, setHours, setMinutes, parseISO } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { SchedulerForm, ScheduleFormData } from "@/components/scheduler/SchedulerForm";

interface ScheduleEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  isAllDay?: boolean;
  color?: string;
  category?: string;
}

// Define Schedule interface to match with the schedules table
interface Schedule {
  id: string;
  title: string;
  description?: string;
  date_from: string;
  date_to: string;
  is_all_day: boolean;
  user_id: string;
  created_at?: string;
  updated_at?: string;
  color?: string;
  category?: string;
}

const SchedulerPage = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [schedules, setSchedules] = useState<ScheduleEvent[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleEvent | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  
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
            description: item.description,
            start: parseISO(item.date_from),
            end: parseISO(item.date_to),
            isAllDay: item.is_all_day || false,
            color: item.color || 'amber',
            category: item.category || 'Work'
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

  const handleCreateSchedule = async (formData: ScheduleFormData) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create schedules",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.title) {
      toast({
        title: "Title required",
        description: "Please enter a title for your schedule",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Parse times
      let finalStartDate = new Date(formData.startDate);
      let finalEndDate = new Date(formData.endDate);
      
      if (!formData.isAllDay) {
        const [startHours, startMinutes] = formData.startTime.split(':').map(Number);
        const [endHours, endMinutes] = formData.endTime.split(':').map(Number);
        
        finalStartDate = setMinutes(setHours(finalStartDate, startHours), startMinutes);
        finalEndDate = setMinutes(setHours(finalEndDate, endHours), endMinutes);
      }
      
      if (finalEndDate < finalStartDate) {
        toast({
          title: "Invalid date range",
          description: "End date must be after start date",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // For recurring schedules, create multiple entries
      if (formData.recurringType !== 'none' && formData.recurringDays.length > 0) {
        // Handle recurring schedules
        const daysMap: Record<string, number> = {
          "sunday": 0, "monday": 1, "tuesday": 2, "wednesday": 3, 
          "thursday": 4, "friday": 5, "saturday": 6
        };
        
        for (const day of formData.recurringDays) {
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
            
            if (!formData.isAllDay) {
              const [startHours, startMinutes] = formData.startTime.split(':').map(Number);
              const [endHours, endMinutes] = formData.endTime.split(':').map(Number);
              
              scheduleStart = setMinutes(setHours(scheduleStart, startHours), startMinutes);
              scheduleEnd = setMinutes(setHours(scheduleEnd, endHours), endMinutes);
            } else {
              // For all-day events, end at end of day
              scheduleEnd = addHours(scheduleEnd, 23);
              scheduleEnd = setMinutes(scheduleEnd, 59);
            }
            
            const newSchedule: Schedule = {
              id: '', // This will be auto-generated by Supabase
              title: `${formData.title} (${day.charAt(0).toUpperCase() + day.slice(1)})`,
              description: formData.description,
              date_from: scheduleStart.toISOString(),
              date_to: scheduleEnd.toISOString(),
              is_all_day: formData.isAllDay,
              color: formData.color,
              category: formData.category,
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
          title: formData.title,
          description: formData.description,
          date_from: finalStartDate.toISOString(),
          date_to: finalEndDate.toISOString(),
          is_all_day: formData.isAllDay,
          color: formData.color,
          category: formData.category,
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
          description: data.description,
          start: new Date(data.date_from),
          end: new Date(data.date_to),
          isAllDay: data.is_all_day || false,
          color: data.color,
          category: data.category
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
          description: item.description,
          start: parseISO(item.date_from),
          end: parseISO(item.date_to),
          isAllDay: item.is_all_day || false,
          color: item.color || 'amber',
          category: item.category || 'Work'
        })));
      }
    } catch (error) {
      console.error('Error creating schedule:', error);
      toast({
        title: "Failed to create schedule",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    try {
      const { error } = await supabase
        .from('schedules')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setSchedules(schedules.filter(schedule => schedule.id !== id));
      setViewDialogOpen(false);
      setSelectedSchedule(null);
      
      toast({
        title: "Schedule deleted",
        description: "Your schedule has been removed"
      });
    } catch (error) {
      console.error('Error deleting schedule:', error);
      toast({
        title: "Failed to delete schedule",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const getColorClass = (color: string = 'amber') => {
    const colorMap: Record<string, string> = {
      'amber': 'bg-amber-500 border-amber-600',
      'blue': 'bg-blue-500 border-blue-600',
      'green': 'bg-green-500 border-green-600',
      'red': 'bg-red-500 border-red-600',
      'purple': 'bg-purple-500 border-purple-600',
      'indigo': 'bg-indigo-500 border-indigo-600',
      'pink': 'bg-pink-500 border-pink-600',
    };
    
    return colorMap[color] || colorMap['amber'];
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
              className="rounded-md border pointer-events-auto"
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
              <Button 
                size="sm" 
                className="bg-amber-600 hover:bg-amber-700"
                onClick={() => setDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" /> Create Schedule
              </Button>
              
              <DialogContent className="sm:max-w-[600px] bg-amber-50 border-amber-200 max-h-[90vh] overflow-hidden">
                <DialogHeader>
                  <DialogTitle className="text-xl">Create New Schedule</DialogTitle>
                  <DialogDescription>
                    Set up a new schedule to manage your day
                  </DialogDescription>
                </DialogHeader>
                
                <SchedulerForm 
                  onSubmit={handleCreateSchedule} 
                  onCancel={() => setDialogOpen(false)}
                  loading={loading}
                />
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
                  <div 
                    key={event.id} 
                    className={`flex items-center p-4 rounded-lg bg-white border-l-4 ${getColorClass(event.color)}`}
                    onClick={() => {
                      setSelectedSchedule(event);
                      setViewDialogOpen(true);
                    }}
                  >
                    <div className="flex-1 cursor-pointer">
                      <div className="flex items-center">
                        <h4 className="text-base font-medium">{event.title}</h4>
                        {event.isAllDay && (
                          <span className="ml-2 px-2 py-0.5 text-xs bg-amber-100 text-amber-800 rounded-full">
                            All day
                          </span>
                        )}
                        {event.category && (
                          <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-800 rounded-full">
                            {event.category}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {format(new Date(event.start), "MMM d, yyyy")}
                        {!event.isAllDay && format(new Date(event.start), ", h:mm a")}
                        {!isSameDay(new Date(event.start), new Date(event.end)) && 
                          ` - ${format(new Date(event.end), "MMM d, yyyy")}`}
                        {!event.isAllDay && !isSameDay(new Date(event.start), new Date(event.end)) && 
                          format(new Date(event.end), ", h:mm a")}
                      </div>
                      {event.description && (
                        <div className="mt-1 text-sm text-gray-600 line-clamp-2">
                          {event.description}
                        </div>
                      )}
                    </div>
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
                  Create a new schedule to begin planning your day
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
      
      {/* View Schedule Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          {selectedSchedule && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl flex items-center justify-between">
                  <span>{selectedSchedule.title}</span>
                  {selectedSchedule.isAllDay && (
                    <span className="text-xs font-normal px-2 py-1 bg-amber-100 text-amber-800 rounded-full">
                      All day
                    </span>
                  )}
                </DialogTitle>
                <DialogDescription>
                  <div className="text-sm text-muted-foreground mt-1">
                    {format(new Date(selectedSchedule.start), "MMMM d, yyyy")}
                    {!selectedSchedule.isAllDay && format(new Date(selectedSchedule.start), ", h:mm a")}
                    {!isSameDay(new Date(selectedSchedule.start), new Date(selectedSchedule.end)) && 
                      ` - ${format(new Date(selectedSchedule.end), "MMMM d, yyyy")}`}
                    {!selectedSchedule.isAllDay && 
                      format(new Date(selectedSchedule.end), ", h:mm a")}
                  </div>
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                {selectedSchedule.description && (
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Description</h4>
                    <p className="text-sm">{selectedSchedule.description}</p>
                  </div>
                )}
                
                {selectedSchedule.category && (
                  <div className="flex items-center">
                    <h4 className="text-sm font-semibold mr-2">Category:</h4>
                    <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-800 rounded-full">
                      {selectedSchedule.category}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    variant="outline" 
                    className="text-gray-600"
                    onClick={() => setViewDialogOpen(false)}
                  >
                    Close
                  </Button>
                  <Button 
                    variant="outline" 
                    className="text-amber-700 border-amber-300"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => handleDeleteSchedule(selectedSchedule.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helper function to add days to a date
const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export default SchedulerPage;

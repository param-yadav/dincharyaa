
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

// Define form schema
const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().optional(),
  isAllDay: z.boolean().default(false),
  dateFrom: z.date(),
  dateTo: z.date(),
  category: z.string().optional(),
  color: z.string().optional(),
});

type ScheduleFormValues = z.infer<typeof formSchema>;

// Time options for the time picker
const timeOptions = Array.from({ length: 24 * 4 }, (_, i) => {
  const hour = Math.floor(i / 4);
  const minute = (i % 4) * 15;
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  const formattedMinute = minute.toString().padStart(2, "0");
  return {
    value: `${hour.toString().padStart(2, "0")}:${formattedMinute}`,
    label: `${formattedHour}:${formattedMinute} ${ampm}`,
  };
});

// Category options
const categoryOptions = [
  "Work", 
  "Personal", 
  "Meeting", 
  "Study", 
  "Breakfast", 
  "Lunch", 
  "Dinner", 
  "Exercise",
  "Basketball",
  "Health",
  "Home",
  "Errands",
  "Other"
];

// Color options
const colorOptions = [
  { value: "blue", label: "Blue", class: "bg-blue-500" },
  { value: "green", label: "Green", class: "bg-green-500" },
  { value: "red", label: "Red", class: "bg-red-500" },
  { value: "yellow", label: "Yellow", class: "bg-yellow-500" },
  { value: "purple", label: "Purple", class: "bg-purple-500" },
  { value: "pink", label: "Pink", class: "bg-pink-500" },
  { value: "indigo", label: "Indigo", class: "bg-indigo-500" },
  { value: "amber", label: "Amber", class: "bg-amber-500" },
];

interface SchedulerFormProps {
  onSuccess?: () => void;
}

const SchedulerForm = ({ onSuccess }: SchedulerFormProps) => {
  const { user } = useAuth();
  const [fromTime, setFromTime] = useState("09:00");
  const [toTime, setToTime] = useState("10:00");
  const [loading, setLoading] = useState(false);

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      isAllDay: false,
      dateFrom: new Date(),
      dateTo: new Date(),
      category: "Work",
      color: "blue",
    },
  });

  // Combine date and time for the form submission
  const combineDateTime = (date: Date, time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes);
    return newDate;
  };

  const onSubmit = async (values: ScheduleFormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create schedules",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const dateFrom = values.isAllDay
        ? new Date(values.dateFrom.setHours(0, 0, 0, 0))
        : combineDateTime(values.dateFrom, fromTime);

      const dateTo = values.isAllDay
        ? new Date(values.dateTo.setHours(23, 59, 59, 999))
        : combineDateTime(values.dateTo, toTime);

      // Validate dates
      if (dateTo < dateFrom) {
        toast({
          title: "Invalid date range",
          description: "End time cannot be before start time",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("schedules").insert({
        title: values.title,
        description: values.description || "",
        date_from: dateFrom.toISOString(),
        date_to: dateTo.toISOString(),
        is_all_day: values.isAllDay,
        category: values.category,
        color: values.color,
        user_id: user.id,
      });

      if (error) throw error;

      // Create tasks from this schedule
      if (!values.isAllDay) {
        await supabase.from("tasks").insert({
          title: values.title,
          description: values.description || "",
          start_time: dateFrom.toISOString(),
          end_time: dateTo.toISOString(),
          category: values.category || "Schedule",
          priority: "medium",
          is_pinned: false,
          completed: false,
          user_id: user.id,
        });
      } else {
        // For all-day events, call the database function to create daily tasks
        await supabase.rpc("create_tasks_from_schedule", {
          schedule_id: "00000000-0000-0000-0000-000000000000", // This will be replaced server-side
          schedule_title: values.title,
        });
      }

      toast({
        title: "Schedule created",
        description: "Your schedule has been created successfully",
      });

      form.reset();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast({
        title: "Error creating schedule",
        description: error.message,
        variant: "destructive",
      });
      console.error("Error creating schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dincharya-text dark:text-white">Title</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter schedule title" 
                  {...field} 
                  className="dark:bg-dincharya-muted/20 dark:text-white dark:border-dincharya-muted/30"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dincharya-text dark:text-white">Description (optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter schedule description" 
                  {...field} 
                  className="dark:bg-dincharya-muted/20 dark:text-white dark:border-dincharya-muted/30"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dincharya-text dark:text-white">Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="dark:bg-dincharya-muted/20 dark:text-white dark:border-dincharya-muted/30">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categoryOptions.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dincharya-text dark:text-white">Color</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="dark:bg-dincharya-muted/20 dark:text-white dark:border-dincharya-muted/30">
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {colorOptions.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${color.class}`} />
                        <span>{color.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isAllDay"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-2 space-y-0">
              <FormControl>
                <Checkbox 
                  checked={field.value} 
                  onCheckedChange={field.onChange} 
                  className="dark:border-white/50"
                />
              </FormControl>
              <FormLabel className="font-normal cursor-pointer text-dincharya-text dark:text-white">
                All day event
              </FormLabel>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Date From */}
          <FormField
            control={form.control}
            name="dateFrom"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-dincharya-text dark:text-white">Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal dark:bg-dincharya-muted/20 dark:text-white dark:border-dincharya-muted/30",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date To */}
          <FormField
            control={form.control}
            name="dateTo"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-dincharya-text dark:text-white">End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal dark:bg-dincharya-muted/20 dark:text-white dark:border-dincharya-muted/30",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Time selectors - only show if not all day event */}
        {!form.watch("isAllDay") && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Time From */}
            <div>
              <FormLabel className="text-dincharya-text dark:text-white">Start Time</FormLabel>
              <Select value={fromTime} onValueChange={setFromTime}>
                <SelectTrigger className="dark:bg-dincharya-muted/20 dark:text-white dark:border-dincharya-muted/30">
                  <SelectValue placeholder="Select start time" />
                  <Clock className="h-4 w-4 opacity-50 ml-2" />
                </SelectTrigger>
                <SelectContent className="h-80">
                  {timeOptions.map((time) => (
                    <SelectItem key={`from-${time.value}`} value={time.value}>
                      {time.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Time To */}
            <div>
              <FormLabel className="text-dincharya-text dark:text-white">End Time</FormLabel>
              <Select value={toTime} onValueChange={setToTime}>
                <SelectTrigger className="dark:bg-dincharya-muted/20 dark:text-white dark:border-dincharya-muted/30">
                  <SelectValue placeholder="Select end time" />
                  <Clock className="h-4 w-4 opacity-50 ml-2" />
                </SelectTrigger>
                <SelectContent className="h-80">
                  {timeOptions.map((time) => (
                    <SelectItem key={`to-${time.value}`} value={time.value}>
                      {time.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-dincharya-primary hover:bg-dincharya-primary/90 text-white dark:text-black"
          >
            {loading ? "Creating..." : "Create Schedule"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SchedulerForm;


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";

interface ScheduleFormProps {
  onSubmit: (data: ScheduleFormData) => void;
  onCancel: () => void;
  loading: boolean;
}

export interface ScheduleFormData {
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
  color: string;
  category: string;
  recurringType: string;
  recurringDays: string[];
}

const colorOptions = [
  { value: "amber", label: "Amber", class: "bg-amber-500" },
  { value: "blue", label: "Blue", class: "bg-blue-500" },
  { value: "green", label: "Green", class: "bg-green-500" },
  { value: "red", label: "Red", class: "bg-red-500" },
  { value: "purple", label: "Purple", class: "bg-purple-500" },
  { value: "indigo", label: "Indigo", class: "bg-indigo-500" },
  { value: "pink", label: "Pink", class: "bg-pink-500" },
];

const categoryOptions = [
  "Work", "Personal", "Meeting", "Education", "Health", "Meal", "Exercise", "Family", "Travel", "Other"
];

const DEFAULT_START_TIME = "09:00";
const DEFAULT_END_TIME = "10:00";

export function SchedulerForm({ onSubmit, onCancel, loading }: ScheduleFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState(DEFAULT_START_TIME);
  const [endTime, setEndTime] = useState(DEFAULT_END_TIME);
  const [isAllDay, setIsAllDay] = useState(false);
  const [color, setColor] = useState("amber");
  const [category, setCategory] = useState("Work");
  const [recurringType, setRecurringType] = useState("none");
  const [recurringDays, setRecurringDays] = useState<string[]>([]);

  const toggleRecurringDay = (day: string) => {
    if (recurringDays.includes(day)) {
      setRecurringDays(recurringDays.filter(d => d !== day));
    } else {
      setRecurringDays([...recurringDays, day]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      title,
      description,
      startDate,
      endDate,
      startTime,
      endTime,
      isAllDay,
      color,
      category,
      recurringType,
      recurringDays,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-base font-medium">Title</Label>
        <Input
          id="title"
          placeholder="Schedule title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border-amber-300 bg-white"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description" className="text-base font-medium">Description</Label>
        <Textarea 
          id="description"
          placeholder="Add details about this schedule"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border-amber-300 bg-white min-h-[80px]"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category" className="text-base font-medium">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category" className="border-amber-300 bg-white">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="color" className="text-base font-medium">Color</Label>
          <Select value={color} onValueChange={setColor}>
            <SelectTrigger id="color" className="border-amber-300 bg-white">
              <SelectValue placeholder="Select color">
                <div className="flex items-center">
                  <div className={`h-4 w-4 rounded-full mr-2 ${colorOptions.find(c => c.value === color)?.class}`} />
                  {colorOptions.find(c => c.value === color)?.label}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {colorOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center">
                    <div className={`h-4 w-4 rounded-full mr-2 ${option.class}`} />
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
        <div className="space-y-2">
          <Label htmlFor="start-date" className="text-base font-medium">Start Date</Label>
          <div className="relative">
            <div className="flex h-10 items-center justify-between rounded-md border border-amber-300 bg-white px-3 py-2 text-sm">
              <span>
                {format(startDate, "MMM dd, yyyy")}
              </span>
              <CalendarIcon className="h-4 w-4 opacity-50" />
            </div>
            <div className="absolute top-full mt-1 z-10 bg-white border border-amber-200 rounded-md shadow-md">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => date && setStartDate(date)}
                className="rounded-md"
                initialFocus
              />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="end-date" className="text-base font-medium">End Date</Label>
          <div className="relative">
            <div className="flex h-10 items-center justify-between rounded-md border border-amber-300 bg-white px-3 py-2 text-sm">
              <span>
                {format(endDate, "MMM dd, yyyy")}
              </span>
              <CalendarIcon className="h-4 w-4 opacity-50" />
            </div>
            <div className="absolute top-full mt-1 z-10 bg-white border border-amber-200 rounded-md shadow-md">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => date && setEndDate(date)}
                className="rounded-md"
                initialFocus
              />
            </div>
          </div>
        </div>
      </div>
      
      {!isAllDay && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
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
          <div className="space-y-2">
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
      
      <div className="space-y-2">
        <Label className="text-base font-medium">Recurring Schedule</Label>
        <Select value={recurringType} onValueChange={setRecurringType}>
          <SelectTrigger className="border-amber-300 bg-white">
            <SelectValue placeholder="Select recurrence" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Not recurring</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {recurringType === 'weekly' && (
        <div className="space-y-2">
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
      
      <div className="text-sm text-amber-700 bg-amber-100 p-3 rounded-md">
        <p><strong>Note:</strong> For multi-day schedules, individual tasks will be automatically created for each day.</p>
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="border-amber-300 text-amber-700"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="bg-amber-600 hover:bg-amber-700"
          disabled={loading || !title}
        >
          {loading ? "Creating..." : "Create Schedule"}
        </Button>
      </div>
    </form>
  );
}

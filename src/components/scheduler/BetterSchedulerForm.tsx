
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { format, parse, setHours, setMinutes } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScheduleFormData {
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
  color: string;
  category: string;
  recurringType: 'none' | 'daily' | 'weekly';
  recurringDays: string[];
}

interface SchedulerFormProps {
  onSubmit: (data: ScheduleFormData) => void;
  onCancel: () => void;
  loading: boolean;
  initialData?: Partial<ScheduleFormData>;
}

const BetterSchedulerForm = ({ onSubmit, onCancel, loading, initialData }: SchedulerFormProps) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [startDate, setStartDate] = useState<Date>(initialData?.startDate || new Date());
  const [endDate, setEndDate] = useState<Date>(initialData?.endDate || new Date());
  const [startTime, setStartTime] = useState(initialData?.startTime || "09:00");
  const [endTime, setEndTime] = useState(initialData?.endTime || "10:00");
  const [isAllDay, setIsAllDay] = useState(initialData?.isAllDay || false);
  const [color, setColor] = useState(initialData?.color || "amber");
  const [category, setCategory] = useState(initialData?.category || "Work");
  const [recurringType, setRecurringType] = useState<'none' | 'daily' | 'weekly'>(initialData?.recurringType || 'none');
  const [recurringDays, setRecurringDays] = useState<string[]>(initialData?.recurringDays || []);

  const handleRecurringDayToggle = (day: string) => {
    if (recurringDays.includes(day)) {
      setRecurringDays(recurringDays.filter(d => d !== day));
    } else {
      setRecurringDays([...recurringDays, day]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      return;
    }

    const formData: ScheduleFormData = {
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
      recurringDays
    };

    onSubmit(formData);
  };

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
    "Work",
    "Personal",
    "Home",
    "Breakfast",
    "Lunch",
    "Dinner",
    "Meeting",
    "Exercise",
    "Study",
    "Errands",
    "Health",
    "Other"
  ];

  const weekdays = [
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
    { value: "sunday", label: "Sunday" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4 dark:text-white">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title" className="text-base font-medium">
            Title
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 dark:bg-dincharya-muted dark:border-dincharya-border dark:text-white"
            placeholder="Enter schedule title"
            required
          />
        </div>

        <div>
          <Label htmlFor="description" className="text-base font-medium">
            Description
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 dark:bg-dincharya-muted dark:border-dincharya-border dark:text-white"
            placeholder="Enter description (optional)"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate" className="text-base font-medium">
              Start Date
            </Label>
            <div className="mt-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal dark:bg-dincharya-muted dark:border-dincharya-border dark:text-white",
                      !startDate && "text-muted-foreground dark:text-gray-400"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 dark:bg-dincharya-text" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <Label htmlFor="endDate" className="text-base font-medium">
              End Date
            </Label>
            <div className="mt-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal dark:bg-dincharya-muted dark:border-dincharya-border dark:text-white",
                      !endDate && "text-muted-foreground dark:text-gray-400"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 dark:bg-dincharya-text" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => date && setEndDate(date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="all-day"
            checked={isAllDay}
            onCheckedChange={setIsAllDay}
          />
          <Label htmlFor="all-day" className="text-base font-medium cursor-pointer">
            All Day
          </Label>
        </div>

        {!isAllDay && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime" className="text-base font-medium">
                Start Time
              </Label>
              <div className="mt-1 relative">
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="dark:bg-dincharya-muted dark:border-dincharya-border dark:text-white"
                  required={!isAllDay}
                />
                <Clock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div>
              <Label htmlFor="endTime" className="text-base font-medium">
                End Time
              </Label>
              <div className="mt-1 relative">
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="dark:bg-dincharya-muted dark:border-dincharya-border dark:text-white"
                  required={!isAllDay}
                />
                <Clock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="category" className="text-base font-medium">
            Category
          </Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="mt-1 dark:bg-dincharya-muted dark:border-dincharya-border dark:text-white">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="dark:bg-dincharya-text dark:border-dincharya-border">
              {categoryOptions.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="color" className="text-base font-medium">
            Color
          </Label>
          <Select value={color} onValueChange={setColor}>
            <SelectTrigger className="mt-1 dark:bg-dincharya-muted dark:border-dincharya-border dark:text-white">
              <SelectValue placeholder="Select color">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-2 ${colorOptions.find(c => c.value === color)?.class}`}></div>
                  {colorOptions.find(c => c.value === color)?.label}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="dark:bg-dincharya-text dark:border-dincharya-border">
              {colorOptions.map((colorOption) => (
                <SelectItem key={colorOption.value} value={colorOption.value}>
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-2 ${colorOption.class}`}></div>
                    {colorOption.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="recurring" className="text-base font-medium">
            Recurring
          </Label>
          <Select value={recurringType} onValueChange={(value) => setRecurringType(value as 'none' | 'daily' | 'weekly')}>
            <SelectTrigger className="mt-1 dark:bg-dincharya-muted dark:border-dincharya-border dark:text-white">
              <SelectValue placeholder="Recurring options" />
            </SelectTrigger>
            <SelectContent className="dark:bg-dincharya-text dark:border-dincharya-border">
              <SelectItem value="none">None (Single event)</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {recurringType === 'weekly' && (
          <div className="space-y-2">
            <Label className="text-base font-medium">
              Repeat on
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1">
              {weekdays.map((day) => (
                <div key={day.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`day-${day.value}`}
                    checked={recurringDays.includes(day.value)}
                    onChange={() => handleRecurringDayToggle(day.value)}
                    className="h-4 w-4 rounded text-amber-600 dark:text-amber-500 focus:ring-amber-500 dark:focus:ring-amber-600"
                  />
                  <Label htmlFor={`day-${day.value}`} className="cursor-pointer">
                    {day.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel} type="button" disabled={loading} className="dark:bg-dincharya-muted dark:text-white dark:border-dincharya-border">
          Cancel
        </Button>
        <Button type="submit" className="bg-amber-600 hover:bg-amber-700" disabled={loading}>
          {loading ? 'Creating...' : 'Create Schedule'}
        </Button>
      </div>
    </form>
  );
};

export default BetterSchedulerForm;

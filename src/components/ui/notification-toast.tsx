
import React, { useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { Bell } from "lucide-react";
import { useTasks } from "@/hooks/use-tasks";

export const NotificationToasts: React.FC = () => {
  const { tasks } = useTasks();
  
  useEffect(() => {
    // Set up an interval to check for upcoming tasks every minute
    const checkInterval = setInterval(() => {
      const now = new Date();
      const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60000);
      
      tasks.forEach(task => {
        if (task.completed) return;
        
        const startTime = new Date(task.start_time);
        
        // Check if task is starting within the next 5 minutes and hasn't already been notified
        if (!task.reminder_sent && 
            startTime > now && 
            startTime <= fiveMinutesFromNow) {
          
          // Display a notification toast
          toast({
            title: "Task Reminder",
            description: `"${task.title}" starts at ${startTime.toLocaleTimeString()}`,
            action: (
              <div className="flex items-center p-2 bg-dincharya-primary/20 rounded-md">
                <Bell className="h-4 w-4 mr-1 text-dincharya-primary" />
              </div>
            ),
            duration: 10000, // 10 seconds
          });
        }
      });
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(checkInterval);
  }, [tasks]);
  
  return null; // This component doesn't render anything visible
};

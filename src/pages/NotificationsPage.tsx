
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { BellRing, Check, Clock, Calendar, FileText, Users, User, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  type: "task" | "schedule" | "team" | "system";
  source_id?: string;
  action_url?: string;
}

const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | null>(null);

  // Fetch notifications from Supabase or local storage
  useEffect(() => {
    // Check browser notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    const fetchNotifications = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Try to load from localStorage first
        const savedNotifications = localStorage.getItem(`notifications_${user.id}`);
        if (savedNotifications) {
          setNotifications(JSON.parse(savedNotifications));
        }

        // In a real app, you would fetch from Supabase here
        // const { data, error } = await supabase
        //   .from('notifications')
        //   .select('*')
        //   .eq('user_id', user.id)
        //   .order('created_at', { ascending: false });
        
        // if (error) throw error;
        // if (data) setNotifications(data);

        // For now, use mock data if no saved notifications
        if (!savedNotifications) {
          const mockNotifications: Notification[] = [
            {
              id: "1",
              title: "New Team Member",
              message: "John Doe has joined your team",
              created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
              read: false,
              type: "team",
              action_url: "/team"
            },
            {
              id: "2",
              title: "Task Reminder",
              message: "Your task 'Project Submission' is due tomorrow",
              created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
              read: false,
              type: "task",
              source_id: "task-123",
              action_url: "/tasks"
            },
            {
              id: "3",
              title: "Schedule Updated",
              message: "Weekly Team Meeting has been rescheduled to Friday",
              created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
              read: false,
              type: "schedule",
              source_id: "schedule-456",
              action_url: "/scheduler"
            }
          ];
          
          setNotifications(mockNotifications);
          // Save to localStorage
          localStorage.setItem(`notifications_${user.id}`, JSON.stringify(mockNotifications));
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast({
          title: "Error",
          description: "Failed to fetch notifications",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotifications();
  }, [user]);

  // Save notifications to localStorage when they change
  useEffect(() => {
    if (user && notifications.length > 0) {
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(notifications));
    }
  }, [notifications, user]);

  const filteredNotifications = activeTab === "all" 
    ? notifications 
    : activeTab === "unread"
      ? notifications.filter(n => !n.read)
      : notifications.filter(n => n.type === activeTab);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === notificationId ? { ...notification, read: true } : notification
    ));
    toast({
      title: "Notification marked as read",
      description: "This notification has been marked as read"
    });
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    toast({
      title: "All notifications read",
      description: "All notifications have been marked as read"
    });
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      toast({
        title: "Notifications not supported",
        description: "Your browser doesn't support notifications",
        variant: "destructive"
      });
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        toast({
          title: "Notifications enabled",
          description: "You will now receive notifications"
        });
        
        // Show a test notification
        new Notification("Notifications Enabled", {
          body: "You will now receive notifications from Dincharya",
          icon: "/favicon.ico"
        });
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      toast({
        title: "Permission error",
        description: "Failed to request notification permission",
        variant: "destructive"
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "task":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "schedule":
        return <Calendar className="h-5 w-5 text-amber-500" />;
      case "team":
        return <Users className="h-5 w-5 text-green-500" />;
      case "system":
        return <User className="h-5 w-5 text-purple-500" />;
      default:
        return <BellRing className="h-5 w-5 text-gray-500" />;
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="mb-6">Please sign in to view your notifications</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-dincharya-text dark:text-white mb-6">
        Notifications {unreadCount > 0 && (
          <span className="ml-2 inline-flex items-center justify-center rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-medium text-white">
            {unreadCount} New
          </span>
        )}
      </h1>
      
      {notificationPermission !== 'granted' && (
        <Card className="mb-6 bg-blue-50 dark:bg-blue-900/10 border-blue-200">
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Bell className="h-5 w-5 text-blue-500 mr-2" />
              <p className="text-sm">Enable browser notifications to stay updated</p>
            </div>
            <Button 
              variant="outline" 
              className="border-blue-300 hover:bg-blue-100"
              onClick={requestNotificationPermission}
            >
              Enable Notifications
            </Button>
          </CardContent>
        </Card>
      )}
      
      <Card className="bg-white dark:bg-dincharya-text/80 rounded-lg overflow-hidden shadow">
        <CardHeader className="bg-amber-50 dark:bg-amber-900/10">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <BellRing className="mr-2 h-5 w-5 text-amber-600" />
              Notification Center
            </CardTitle>
            {unreadCount > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                className="border-amber-300 hover:bg-amber-100"
                onClick={markAllAsRead}
              >
                <Check className="mr-2 h-4 w-4" />
                Mark all as read
              </Button>
            )}
          </div>
          <CardDescription>
            Stay updated with tasks, schedules, and team activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="mt-4" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-5 mb-6">
              <TabsTrigger value="all" className="flex items-center justify-center">
                All {notifications.length > 0 && (
                  <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs">{notifications.length}</span>
                )}
              </TabsTrigger>
              <TabsTrigger value="unread" className="flex items-center justify-center">
                Unread {unreadCount > 0 && (
                  <span className="ml-2 rounded-full bg-red-100 text-red-700 px-2 py-0.5 text-xs">{unreadCount}</span>
                )}
              </TabsTrigger>
              <TabsTrigger value="task">Tasks</TabsTrigger>
              <TabsTrigger value="schedule">Schedules</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="space-y-0 mt-2">
              {loading ? (
                <div className="flex flex-col space-y-4 py-4">
                  {[1, 2, 3].map((_, index) => (
                    <div key={index} className="flex items-center space-x-4 animate-pulse">
                      <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredNotifications.length > 0 ? (
                <div className="space-y-0 divide-y">
                  {filteredNotifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={cn(
                        "flex py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/20 px-4 -mx-4 transition-colors",
                        !notification.read && "bg-amber-50 dark:bg-amber-900/10"
                      )}
                      onClick={() => notification.action_url && window.location.assign(notification.action_url)}
                    >
                      <div className="mr-4 flex items-start">
                        <div className="rounded-full p-2 bg-gray-100">
                          {getNotificationIcon(notification.type)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={cn(
                            "text-sm font-medium", 
                            !notification.read && "font-bold"
                          )}>
                            {notification.title}
                          </h4>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className={cn(
                            "text-xs px-2 py-0.5 rounded-full",
                            notification.type === "task" && "bg-blue-100 text-blue-700",
                            notification.type === "schedule" && "bg-amber-100 text-amber-700",
                            notification.type === "team" && "bg-green-100 text-green-700",
                            notification.type === "system" && "bg-purple-100 text-purple-700"
                          )}>
                            {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                          </span>
                          {!notification.read && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 text-muted-foreground hover:text-foreground"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Mark as read
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center py-12">
                  <div className="rounded-full bg-amber-100 p-6 mb-4">
                    <BellRing className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No notifications</h3>
                  <p className="text-muted-foreground text-center max-w-sm">
                    {activeTab === "unread" 
                      ? "You've read all your notifications. Well done!" 
                      : `You don't have any ${activeTab === "all" ? "" : activeTab} notifications yet.`}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsPage;


import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/hooks/use-notifications";
import { formatDistanceToNow } from "date-fns";
import { Bell, Check, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const NotificationsPage = () => {
  const { toast } = useToast();
  const { 
    notifications, 
    loading, 
    markAsRead, 
    markAllAsRead,
    deleteNotification 
  } = useNotifications();

  // Mark notification as read when clicked
  const handleNotificationClick = (notificationId: string) => {
    markAsRead(notificationId);
  };
  
  // Handle mark all as read
  const handleMarkAllAsRead = () => {
    markAllAsRead();
    toast({
      title: "All notifications marked as read",
      description: "Your notification center has been cleared"
    });
  };
  
  // Handle delete notification
  const handleDeleteNotification = (notificationId: string) => {
    deleteNotification(notificationId);
    toast({
      title: "Notification deleted",
      description: "The notification has been removed"
    });
  };
  
  // Check for notification permission
  useEffect(() => {
    const checkNotificationPermission = async () => {
      if ("Notification" in window) {
        const permission = await Notification.permission;
        
        if (permission === "default") {
          toast({
            title: "Enable notifications",
            description: "Allow notifications to stay updated with team invites and task changes",
            action: (
              <Button 
                variant="outline" 
                onClick={() => {
                  Notification.requestPermission().then(result => {
                    if (result === "granted") {
                      toast({
                        title: "Notifications enabled",
                        description: "You'll now receive alerts for important updates"
                      });
                    }
                  });
                }}
              >
                Allow
              </Button>
            )
          });
        }
      }
    };
    
    checkNotificationPermission();
  }, [toast]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with your tasks, team invites, and app announcements
          </p>
        </div>
        
        <Button
          variant="outline"
          className="mt-4 md:mt-0"
          onClick={handleMarkAllAsRead}
          disabled={loading || notifications.every(n => n.read)}
        >
          <Check className="mr-2 h-4 w-4" />
          Mark all as read
        </Button>
      </div>
      
      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <div className="h-6 w-1/3 bg-muted rounded"></div>
                  <div className="h-4 w-1/5 bg-muted rounded"></div>
                </div>
                <div className="h-4 w-2/3 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : notifications.length > 0 ? (
        <div className="grid gap-4">
          {notifications.map(notification => (
            <Card 
              key={notification.id} 
              className={cn(
                "transition-colors border-l-4", 
                notification.read 
                  ? "border-l-gray-200 dark:border-l-gray-700" 
                  : "border-l-amber-500 dark:border-l-amber-600"
              )}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div 
                    className="flex-1 cursor-pointer" 
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="flex items-center mb-1">
                      <h3 className={cn(
                        "text-base font-semibold",
                        !notification.read && "font-bold"
                      )}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span className="ml-2 w-2 h-2 rounded-full bg-amber-500"></span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDeleteNotification(notification.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center p-8">
          <div className="flex flex-col items-center p-6">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Bell className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No notifications</h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              When you receive notifications about team invites, task updates, or system alerts, they'll appear here.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

export default NotificationsPage;

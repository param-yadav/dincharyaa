
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Calendar, 
  List, 
  Users, 
  Clock, 
  Timer, 
  Watch, 
  FileText,
  FileChartColumn,
  Settings,
  HelpCircle,
  Mail,
  BellRing,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNotifications } from "@/hooks/use-notifications";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  isActive?: boolean;
  isCollapsed?: boolean;
  onClick?: () => void;
  notification?: number;
}

const NavItem = ({ 
  icon: Icon, 
  label, 
  to, 
  isActive, 
  isCollapsed, 
  onClick, 
  notification 
}: NavItemProps) => {
  const itemContent = (
    <div className="relative w-full">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3 px-3 transition-all duration-300",
          isActive 
            ? "bg-dincharya-primary/15 text-dincharya-primary font-medium dark:bg-dincharya-primary/30" 
            : "hover:bg-dincharya-primary/5 text-dincharya-text dark:text-white/80 hover:dark:bg-dincharya-primary/20"
        )}
        onClick={onClick}
      >
        <Icon className="h-5 w-5" />
        {!isCollapsed && <span>{label}</span>}
      </Button>
      
      {notification !== undefined && notification > 0 && (
        <span className={cn(
          "absolute rounded-full bg-red-500 text-white text-xs flex items-center justify-center",
          isCollapsed 
            ? "top-1 right-1 min-w-[14px] h-[14px]" 
            : "top-2 right-2 min-w-[18px] h-[18px] px-1"
        )}>
          {notification > 9 ? '9+' : notification}
        </span>
      )}
    </div>
  );

  return isCollapsed ? (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link to={to} className="block w-full mb-1">
            {itemContent}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <Link to={to} className="block w-full mb-1">
      {itemContent}
    </Link>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { unreadCount } = useNotifications();
  
  // Reset collapse state based on screen size
  useEffect(() => {
    setCollapsed(isMobile);
  }, [isMobile]);

  // Store collapsed state in localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null && !isMobile) {
      setCollapsed(savedState === 'true');
    }
  }, [isMobile]);
  
  // Save collapsed state when it changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', collapsed.toString());
  }, [collapsed]);
  
  const navItems = [
    { id: "tasks", label: "Task List", icon: List, path: "/tasks", implemented: true },
    { id: "calendar", label: "Calendar", icon: Calendar, path: "/scheduler", implemented: true },
    { id: "team", label: "Team", icon: Users, path: "/team", implemented: true },
    { id: "notes", label: "Notes", icon: FileText, path: "/notes", implemented: true },
    { id: "timer", label: "Timer", icon: Timer, path: "/timer", implemented: true },
    { id: "analytics", label: "Analytics", icon: FileChartColumn, path: "/analytics", implemented: true }
  ];

  const supportItems = [
    { id: "profile", label: "Profile", icon: User, path: "/profile", implemented: true },
    { id: "notifications", label: "Notifications", icon: BellRing, path: "/notifications", implemented: true, notification: unreadCount },
    { id: "settings", label: "Settings", icon: Settings, path: "/settings", implemented: true },
    { id: "help", label: "Help", icon: HelpCircle, path: "/help", implemented: false },
    { id: "contact", label: "Contact", icon: Mail, path: "/contact", implemented: true }
  ];

  const isCollapsedCalc = collapsed && !hovered;
  
  return (
    <div 
      className={cn(
        "relative h-full bg-white dark:bg-dincharya-text/90 border-r border-dincharya-muted/20 flex flex-col shadow-lg transition-all duration-300",
        isCollapsedCalc ? "w-[70px]" : "w-64"
      )}
      onMouseEnter={() => !isMobile && setHovered(true)}
      onMouseLeave={() => !isMobile && setHovered(false)}
    >
      {/* Collapse Toggle */}
      <button 
        className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-dincharya-background border border-dincharya-muted/30 flex items-center justify-center z-10 shadow-md"
        onClick={() => setCollapsed(!collapsed)}
      >
        {isCollapsedCalc ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>

      {/* Background Texture */}
      <div className="absolute inset-0 opacity-5 dark:opacity-5 pointer-events-none">
        <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBmaWxsPSIjQjg0QzE0IiBkPSJNMzYgMzRoLTJWMTZoMnpNNDAgMzRoLTJWMTZoMnpNOCAzNEg2VjE2aDJ6TTEyIDM0aC0yVjE2aDJ6Ii8+PHBhdGggZD0iTTYwIDBoLTJ2NjBoMnpNNDIgMGgtMnY2MGgyeiIgZmlsbD0iI0I4NEMxNCIvPjxwYXRoIGQ9Ik01MCAwbC01MCA1MEw1MCA2MHoiIHN0cm9rZT0iI0I4NEMxNCIvPjxwYXRoIGQ9Ik01MCAwbC01MCA1MEw1MCA2MHpNMTYtOGwtMjUgMjVMNDAgNjZ6TTU4LTE3bC0yNSAyNUw4MiA1N3oiIHN0cm9rZT0iI0I4NEMxNCIvPjwvZz48L3N2Zz4=')]" />
      </div>

      <div className={cn("p-4 flex items-center", isCollapsedCalc ? "justify-center" : "")}>
        {isCollapsedCalc ? (
          <div className="h-8 w-8 rounded-full bg-dincharya-primary/20 flex items-center justify-center">
            <Clock className="h-5 w-5 text-dincharya-primary" />
          </div>
        ) : (
          <h1 className="text-xl font-bold text-dincharya-primary flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-dincharya-primary/20 flex items-center justify-center">
              <Clock className="h-4 w-4 text-dincharya-primary" />
            </div>
            Dincharya
          </h1>
        )}
      </div>
      
      {/* Main Navigation */}
      <div className="flex-1 p-3 overflow-auto">
        <div className="mb-4">
          {!isCollapsedCalc && (
            <p className="text-xs uppercase text-dincharya-text/50 dark:text-white/50 font-semibold ml-3 mb-2">
              Main
            </p>
          )}
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <NavItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                to={item.path}
                isActive={isActive}
                isCollapsed={isCollapsedCalc}
                onClick={!item.implemented ? () => toast({
                  title: "Coming Soon",
                  description: `The ${item.label} feature is under development`,
                }) : undefined}
              />
            );
          })}
        </div>
        
        {/* Support Section */}
        <div>
          {!isCollapsedCalc && (
            <p className="text-xs uppercase text-dincharya-text/50 dark:text-white/50 font-semibold ml-3 mb-2">
              Support
            </p>
          )}
          {supportItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <NavItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                to={item.path}
                isActive={isActive}
                isCollapsed={isCollapsedCalc}
                notification={item.notification}
                onClick={!item.implemented ? () => toast({
                  title: "Coming Soon",
                  description: `The ${item.label} feature is under development`,
                }) : undefined}
              />
            );
          })}
        </div>
      </div>
      
      {/* User Section */}
      <div className="p-3 border-t border-dincharya-muted/20">
        {user ? (
          <Link to="/profile">
            <Button 
              variant="outline" 
              className={cn(
                "w-full flex items-center justify-center gap-2", 
                isCollapsedCalc && "px-0"
              )}
            >
              <User className="h-4 w-4" /> 
              {!isCollapsedCalc && "My Profile"}
            </Button>
          </Link>
        ) : (
          <Link to="/auth">
            <Button 
              variant="outline" 
              className={cn(
                "w-full flex items-center justify-center gap-2", 
                isCollapsedCalc && "px-0"
              )}
            >
              <User className="h-4 w-4" /> 
              {!isCollapsedCalc && "Sign In"}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

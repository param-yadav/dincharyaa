
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
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  isActive?: boolean;
  isImplemented?: boolean;
  onClick?: () => void;
}

const NavItem = ({ icon: Icon, label, to, isActive, isImplemented, onClick }: NavItemProps) => {
  return (
    <Link to={isImplemented ? to : "#"} className="block w-full mb-1" onClick={onClick}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3 px-3 transition-all duration-300",
          isActive 
            ? "bg-dincharya-primary/15 text-dincharya-primary font-medium dark:bg-dincharya-primary/30" 
            : "hover:bg-dincharya-primary/5 text-dincharya-text dark:text-white/80 hover:dark:bg-dincharya-primary/20"
        )}
      >
        <Icon className="h-5 w-5" />
        <span>{label}</span>
      </Button>
    </Link>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);
  
  // Reset collapse state based on screen size
  useEffect(() => {
    setCollapsed(isMobile);
  }, [isMobile]);
  
  const navItems = [
    { id: "tasks", label: "Task List", icon: List, path: "/tasks", implemented: true },
    { id: "calendar", label: "Calendar", icon: Calendar, path: "/calendar", implemented: false },
    { id: "team", label: "Team", icon: Users, path: "/team", implemented: false },
    { id: "notes", label: "Notes", icon: FileText, path: "/notes", implemented: false },
    { id: "timer", label: "Timer", icon: Timer, path: "/timer", implemented: false },
    { id: "stopwatch", label: "Stopwatch", icon: Watch, path: "/stopwatch", implemented: false },
    { id: "analysis", label: "Analysis", icon: FileChartColumn, path: "/analysis", implemented: false }
  ];

  const supportItems = [
    { id: "settings", label: "Settings", icon: Settings, path: "/settings", implemented: false },
    { id: "help", label: "Help & Support", icon: HelpCircle, path: "/help", implemented: false },
    { id: "contact", label: "Contact Us", icon: Mail, path: "/contact", implemented: true }
  ];

  const handleComingSoon = (feature: string) => {
    toast({
      title: "Coming Soon",
      description: `The ${feature} feature is under development`,
    });
  };

  return (
    <div className={cn(
      "relative h-full bg-white dark:bg-dincharya-text/90 border-r border-dincharya-muted/20 flex flex-col shadow-lg transition-all duration-300",
      collapsed ? "w-[70px]" : "w-64"
    )}>
      {/* Collapse Toggle */}
      <button 
        className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-dincharya-background border border-dincharya-muted/30 flex items-center justify-center z-10 shadow-md"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>

      {/* Background Texture */}
      <div className="absolute inset-0 opacity-5 dark:opacity-5 pointer-events-none">
        <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBmaWxsPSIjQjg0QzE0IiBkPSJNMzYgMzRoLTJWMTZoMnpNNDAgMzRoLTJWMTZoMnpNOCAzNEg2VjE2aDJ6TTEyIDM0aC0yVjE2aDJ6Ii8+PHBhdGggZD0iTTYwIDBoLTJ2NjBoMnpNNDIgMGgtMnY2MGgyeiIgZmlsbD0iI0I4NEMxNCIvPjxwYXRoIGQ9Ik01MCAwbC01MCA1MEw1MCA2MHoiIHN0cm9rZT0iI0I4NEMxNCIvPjxwYXRoIGQ9Ik01MCAwbC01MCA1MEw1MCA2MHpNMTYtOGwtMjUgMjVMNDAgNjZ6TTU4LTE3bC0yNSAyNUw4MiA1N3oiIHN0cm9rZT0iI0I4NEMxNCIvPjwvZz48L3N2Zz4=')]" />
      </div>

      <div className={cn("p-4 flex items-center", collapsed ? "justify-center" : "")}>
        {collapsed ? (
          <div className="h-8 w-8 rounded-full bg-dincharya-primary/20 flex items-center justify-center">
            <Clock className="h-5 w-5 text-dincharya-primary" />
          </div>
        ) : (
          <h1 className="text-xl font-bold text-dincharya-primary flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-dincharya-primary/20 flex items-center justify-center">
              <Clock className="h-4 w-4 text-dincharya-primary" />
            </div>
            Dincharya Tasks
          </h1>
        )}
      </div>
      
      {/* Main Navigation */}
      <div className="flex-1 p-3 overflow-auto">
        <div className="mb-4">
          {!collapsed && (
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
                label={collapsed ? "" : item.label}
                to={item.path}
                isActive={isActive}
                isImplemented={item.implemented}
                onClick={!item.implemented ? () => handleComingSoon(item.label) : undefined}
              />
            );
          })}
        </div>
        
        {/* Support Section */}
        <div>
          {!collapsed && (
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
                label={collapsed ? "" : item.label}
                to={item.path}
                isActive={isActive}
                isImplemented={item.implemented}
                onClick={!item.implemented ? () => handleComingSoon(item.label) : undefined}
              />
            );
          })}
        </div>
      </div>
      
      {/* User Section */}
      <div className="p-3 border-t border-dincharya-muted/20">
        <Button variant="outline" className={cn("w-full", collapsed && "px-0")}>
          <Users className="h-4 w-4 mr-2" /> {!collapsed && "Manage Team"}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;

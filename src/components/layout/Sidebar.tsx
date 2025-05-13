
import { useState } from "react";
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
  Mail
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  isActive?: boolean;
  onClick?: () => void;
}

const NavItem = ({ icon: Icon, label, to, isActive, onClick }: NavItemProps) => {
  return (
    <Link to={to} className="block w-full mb-1" onClick={onClick}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3 px-3",
          isActive 
            ? "bg-dincharya-primary/10 text-dincharya-primary font-medium" 
            : "hover:bg-dincharya-primary/5 text-dincharya-text"
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
  
  const navItems = [
    { id: "tasks", label: "Task List", icon: List, path: "/tasks" },
    { id: "calendar", label: "Calendar", icon: Calendar, path: "/calendar" },
    { id: "team", label: "Team", icon: Users, path: "/team" },
    { id: "notes", label: "Notes", icon: FileText, path: "/notes" },
    { id: "timer", label: "Timer", icon: Timer, path: "/timer" },
    { id: "stopwatch", label: "Stopwatch", icon: Watch, path: "/stopwatch" },
    { id: "analysis", label: "Analysis", icon: FileChartColumn, path: "/analysis" }
  ];

  const supportItems = [
    { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
    { id: "help", label: "Help & Support", icon: HelpCircle, path: "/help" },
    { id: "contact", label: "Contact Us", icon: Mail, path: "/contact" }
  ];

  const handleComingSoon = (feature: string) => {
    toast({
      title: "Coming Soon",
      description: `The ${feature} feature is under development`,
    });
  };

  return (
    <div className="h-full w-64 bg-white dark:bg-dincharya-text/90 border-r border-dincharya-muted/20 flex flex-col shadow-lg">
      <div className="p-4">
        <h1 className="text-xl font-bold text-dincharya-primary flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-dincharya-primary/20 flex items-center justify-center">
            <Clock className="h-4 w-4 text-dincharya-primary" />
          </div>
          Dincharya Tasks
        </h1>
      </div>
      
      {/* Main Navigation */}
      <div className="flex-1 p-3 overflow-auto">
        <div className="mb-4">
          <p className="text-xs uppercase text-dincharya-text/50 font-semibold ml-3 mb-2">
            Main
          </p>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const isImplemented = ["/tasks"].includes(item.path);
            
            return (
              <NavItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                to={isImplemented ? item.path : "#"}
                isActive={isActive}
                onClick={!isImplemented ? () => handleComingSoon(item.label) : undefined}
              />
            );
          })}
        </div>
        
        {/* Support Section */}
        <div>
          <p className="text-xs uppercase text-dincharya-text/50 font-semibold ml-3 mb-2">
            Support
          </p>
          {supportItems.map((item) => {
            const isActive = location.pathname === item.path;
            const isImplemented = ["/contact"].includes(item.path);
            
            return (
              <NavItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                to={isImplemented ? item.path : "#"}
                isActive={isActive}
                onClick={!isImplemented ? () => handleComingSoon(item.label) : undefined}
              />
            );
          })}
        </div>
      </div>
      
      {/* User Section */}
      <div className="p-3 border-t border-dincharya-muted/20">
        <Button variant="outline" className="w-full">
          <Users className="h-4 w-4 mr-2" /> Manage Team
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;

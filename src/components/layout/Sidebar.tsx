
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Calendar, 
  List, 
  Users, 
  Clock, 
  Timer, 
  Stopwatch, 
  FileText,
  FileChartColumn
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}

const NavItem = ({ icon: Icon, label, isActive, onClick }: NavItemProps) => {
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-3 px-3 mb-1",
        isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-primary/5"
      )}
      onClick={onClick}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Button>
  );
};

const Sidebar = () => {
  const [activeView, setActiveView] = useState("tasks");
  const { toast } = useToast();
  
  const navItems = [
    { id: "tasks", label: "Task List", icon: List },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "team", label: "Team", icon: Users },
    { id: "notes", label: "Notes", icon: FileText },
    { id: "timer", label: "Timer", icon: Timer },
    { id: "stopwatch", label: "Stopwatch", icon: Stopwatch },
    { id: "analysis", label: "Analysis", icon: FileChartColumn }
  ];

  const handleNavigation = (id: string) => {
    setActiveView(id);
    // For demo, show a toast for views not yet implemented
    if (id !== "tasks" && id !== "calendar") {
      toast({
        title: "Coming Soon",
        description: `The ${id} view is under development`,
      });
    }
  };

  return (
    <div className="h-screen w-64 border-r bg-sidebar flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-primary flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
            <Clock className="h-4 w-4 text-primary" />
          </div>
          Madhubani Tasks
        </h1>
      </div>
      <div className="flex-1 p-3 overflow-auto">
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={activeView === item.id}
            onClick={() => handleNavigation(item.id)}
          />
        ))}
      </div>
      <div className="p-3 border-t">
        <Button variant="outline" className="w-full">
          <Users className="h-4 w-4 mr-2" /> Manage Team
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;

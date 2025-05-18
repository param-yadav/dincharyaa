
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Calendar, ListTodo, Users, Settings, HelpCircle, ChevronDown, ChevronUp, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMobile } from "@/hooks/use-mobile";

// Alias for backward compatibility
const useIsMobile = useMobile;

const Sidebar = () => {
  const location = useLocation();
  const { signOut, user } = useAuth();
  const [isTeamExpanded, setIsTeamExpanded] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex flex-col h-screen w-64 bg-dincharya-background border-r border-dincharya-border dark:bg-dincharya-text/90 dark:border-dincharya-border">
      {/* Logo and App Title */}
      <div className="flex items-center justify-center h-16 border-b border-dincharya-border dark:border-dincharya-border p-4">
        <span className="font-bold text-lg text-dincharya-text dark:text-white">
          Dincharya
        </span>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link
              to="/home"
              className={`flex items-center p-2 rounded-md hover:bg-dincharya-muted/50 dark:hover:bg-dincharya-muted/20 ${
                isActive("/home")
                  ? "bg-dincharya-muted/50 dark:bg-dincharya-muted/20"
                  : ""
              }`}
            >
              <Home className="h-4 w-4 mr-2 text-dincharya-primary" />
              <span className="text-sm font-medium text-dincharya-text dark:text-white">
                Home
              </span>
            </Link>
          </li>
          <li>
            <Link
              to="/tasks"
              className={`flex items-center p-2 rounded-md hover:bg-dincharya-muted/50 dark:hover:bg-dincharya-muted/20 ${
                isActive("/tasks")
                  ? "bg-dincharya-muted/50 dark:bg-dincharya-muted/20"
                  : ""
              }`}
            >
              <ListTodo className="h-4 w-4 mr-2 text-dincharya-primary" />
              <span className="text-sm font-medium text-dincharya-text dark:text-white">
                Tasks
              </span>
            </Link>
          </li>
          <li>
            <Link
              to="/scheduler"
              className={`flex items-center p-2 rounded-md hover:bg-dincharya-muted/50 dark:hover:bg-dincharya-muted/20 ${
                isActive("/scheduler")
                  ? "bg-dincharya-muted/50 dark:bg-dincharya-muted/20"
                  : ""
              }`}
            >
              <Calendar className="h-4 w-4 mr-2 text-dincharya-primary" />
              <span className="text-sm font-medium text-dincharya-text dark:text-white">
                Scheduler
              </span>
            </Link>
          </li>
          <li>
            <Link
              to="/team"
              className={`flex items-center justify-between p-2 rounded-md hover:bg-dincharya-muted/50 dark:hover:bg-dincharya-muted/20 ${
                isActive("/team") || isTeamExpanded
                  ? "bg-dincharya-muted/50 dark:bg-dincharya-muted/20"
                  : ""
              }`}
              onClick={() => setIsTeamExpanded(!isTeamExpanded)}
            >
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-dincharya-primary" />
                <span className="text-sm font-medium text-dincharya-text dark:text-white">
                  Team
                </span>
              </div>
              {isTeamExpanded ? (
                <ChevronUp className="h-4 w-4 text-dincharya-text dark:text-white" />
              ) : (
                <ChevronDown className="h-4 w-4 text-dincharya-text dark:text-white" />
              )}
            </Link>
          </li>
          {isTeamExpanded && (
            <ul className="ml-4 space-y-2">
              <li>
                <Link
                  to="/team"
                  className={`flex items-center p-2 rounded-md hover:bg-dincharya-muted/50 dark:hover:bg-dincharya-muted/20 ${
                    isActive("/team")
                      ? "bg-dincharya-muted/50 dark:bg-dincharya-muted/20"
                      : ""
                  }`}
                >
                  <span className="text-sm font-medium text-dincharya-text dark:text-white">
                    Manage Team
                  </span>
                </Link>
              </li>
            </ul>
          )}
        </ul>
      </nav>

      {/* Bottom Section - User Profile and Settings */}
      <div className="p-4 border-t border-dincharya-border dark:border-dincharya-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex h-8 w-full items-center justify-between rounded-md px-2 text-sm font-medium hover:bg-dincharya-muted/50 focus:bg-dincharya-muted/50 data-[state=open]:bg-dincharya-muted/50 dark:hover:bg-dincharya-muted/20 dark:focus:bg-dincharya-muted/20 dark:data-[state=open]:bg-dincharya-muted/20">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-dincharya-text dark:text-white">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link to="/profile">
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings">
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/help">
                Help
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Sidebar;


import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, X, Sun, Moon, LogIn, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

const Header = ({ toggleSidebar, sidebarOpen }: HeaderProps) => {
  const isMobile = useIsMobile();
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Would come from auth context in real app
  const { toast } = useToast();
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleAuthAction = () => {
    if (isLoggedIn) {
      // This would be connected to Supabase or another auth provider
      setIsLoggedIn(false);
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } else {
      navigate("/auth");
    }
  };

  useEffect(() => {
    // Check user preference
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
    if (isDark) document.documentElement.classList.add('dark');
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-dincharya-text/90 shadow-md border-b border-dincharya-muted/20 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 text-dincharya-text dark:text-white"
              onClick={toggleSidebar}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          )}
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/7b9e64ad-467b-4f8e-b543-70e78e2ceb8a.png" 
              alt="Dincharya" 
              className="h-8 w-auto"
            />
            <span className="ml-2 text-xl font-bold text-dincharya-primary">Dincharya</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/tasks">Tasks</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleDarkMode}
            className="ml-2"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          <Button 
            className="ml-4 bg-dincharya-primary hover:bg-dincharya-primary/90"
            onClick={handleAuthAction}
          >
            {isLoggedIn ? (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </>
            )}
          </Button>
        </nav>
        
        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleDarkMode}
            className="mr-2"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          <Button variant="ghost" onClick={toggleMenu}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-dincharya-text shadow-lg absolute w-full z-20 animate-fade-in">
          <div className="flex flex-col p-4 space-y-2">
            <MobileNavLink to="/" onClick={() => setMenuOpen(false)}>Home</MobileNavLink>
            <MobileNavLink to="/tasks" onClick={() => setMenuOpen(false)}>Tasks</MobileNavLink>
            <MobileNavLink to="/about" onClick={() => setMenuOpen(false)}>About</MobileNavLink>
            <MobileNavLink to="/contact" onClick={() => setMenuOpen(false)}>Contact</MobileNavLink>
            <div className="pt-2 border-t">
              <Button 
                className="w-full bg-dincharya-primary hover:bg-dincharya-primary/90"
                onClick={() => {
                  setMenuOpen(false);
                  handleAuthAction();
                }}
              >
                {isLoggedIn ? (
                  <>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
}

const NavLink = ({ to, children }: NavLinkProps) => (
  <Link 
    to={to} 
    className="px-3 py-2 rounded-md text-dincharya-text dark:text-white hover:bg-dincharya-secondary/30 hover:text-dincharya-primary dark:hover:text-dincharya-secondary font-medium transition-colors"
  >
    {children}
  </Link>
);

interface MobileNavLinkProps extends NavLinkProps {
  onClick: () => void;
}

const MobileNavLink = ({ to, children, onClick }: MobileNavLinkProps) => (
  <Link 
    to={to} 
    className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 w-full text-dincharya-text dark:text-white hover:bg-dincharya-secondary/30"
    onClick={onClick}
  >
    {children}
  </Link>
);

export default Header;

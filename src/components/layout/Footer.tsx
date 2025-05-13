
import { Link } from "react-router-dom";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Heart
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-dincharya-text/90 shadow-md">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <img 
                src="/lovable-uploads/7b9e64ad-467b-4f8e-b543-70e78e2ceb8a.png" 
                alt="Dincharya" 
                className="h-8 w-auto"
              />
              <span className="ml-2 text-xl font-bold text-dincharya-primary">Dincharya</span>
            </Link>
            <p className="text-dincharya-text/80 dark:text-white/70 text-sm">
              Organize your daily tasks, set reminders, and track your progress with Dincharya - your daily task management companion.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-dincharya-primary mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/tasks">Tasks</FooterLink>
              <FooterLink to="/about">About</FooterLink>
              <FooterLink to="/contact">Contact</FooterLink>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="font-semibold text-dincharya-primary mb-4">Support</h3>
            <ul className="space-y-2">
              <FooterLink to="/feedback">Feedback</FooterLink>
              <FooterLink to="/terms">Terms & Conditions</FooterLink>
              <FooterLink to="/privacy">Privacy Policy</FooterLink>
              <FooterLink to="/help">Help Center</FooterLink>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="font-semibold text-dincharya-primary mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-dincharya-primary hover:text-dincharya-accent transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-dincharya-primary hover:text-dincharya-accent transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-dincharya-primary hover:text-dincharya-accent transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-dincharya-primary hover:text-dincharya-accent transition-colors">
                <Youtube size={20} />
              </a>
            </div>
            <p className="text-dincharya-text/80 dark:text-white/70 text-sm">
              Email: support@dincharya.com<br />
              Phone: +1 (555) 123-4567
            </p>
          </div>
        </div>
        
        <div className="border-t border-dincharya-muted/20 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-dincharya-text/70 dark:text-white/60 text-sm">
            &copy; {currentYear} Dincharya. All rights reserved.
          </p>
          <p className="text-dincharya-text/70 dark:text-white/60 text-sm mt-2 md:mt-0 flex items-center">
            Made with <Heart size={16} className="mx-1 text-dincharya-primary" /> for better productivity
          </p>
        </div>
      </div>
    </footer>
  );
};

interface FooterLinkProps {
  to: string;
  children: React.ReactNode;
}

const FooterLink = ({ to, children }: FooterLinkProps) => (
  <li>
    <Link 
      to={to} 
      className="text-dincharya-text/80 hover:text-dincharya-primary dark:text-white/70 dark:hover:text-white text-sm transition-colors"
    >
      {children}
    </Link>
  </li>
);

export default Footer;

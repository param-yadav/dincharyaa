
import { useState, ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

const Layout = ({ children, showSidebar = true }: LayoutProps) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  return (
    <div className="min-h-screen bg-dincharya-background pattern-bg flex flex-col">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      
      <div className="flex-1 flex">
        {showSidebar && (
          <>
            {/* Sidebar */}
            <div
              className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto pt-16 ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <Sidebar />
            </div>
            
            {/* Backdrop for mobile sidebar */}
            {isMobile && sidebarOpen && (
              <div
                className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
                onClick={() => setSidebarOpen(false)}
                aria-hidden="true"
              />
            )}
          </>
        )}
        
        {/* Main content */}
        <main className={`flex-1 flex flex-col ${showSidebar ? "lg:ml-0" : ""} pt-16`}>
          <div className="container mx-auto px-4 py-6 flex-1">
            {children}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Layout;

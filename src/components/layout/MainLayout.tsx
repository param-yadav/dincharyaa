
import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/hooks/use-auth";
import { NotificationToasts } from "@/components/ui/notification-toast";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  useEffect(() => {
    if (!loading && !user) {
      // Use window.location instead of navigate
      window.location.href = "/auth";
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in the useEffect
  }
  
  return (
    <div className="flex min-h-screen bg-dincharya-background overflow-hidden">
      {/* Add NotificationToasts component to ensure reminders work globally */}
      <NotificationToasts />
      
      <Sidebar />
      <main className="flex-1 p-4">
        {children}
        <Toaster />
      </main>
    </div>
  );
};

export default MainLayout;

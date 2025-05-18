
import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { NotificationToasts } from "@/components/ui/notification-toast";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !user) {
      navigate("/sign-in");
    }
  }, [user, loading, navigate]);

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

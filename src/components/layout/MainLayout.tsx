import React from "react";
import Sidebar from "./Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/hooks/use-auth";
import { redirect } from "next/navigation";
import { NotificationToasts } from "@/components/ui/notification-toast";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    redirect("/sign-in");
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

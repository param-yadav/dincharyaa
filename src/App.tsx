
import React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import router from "./routes";
import { RouterProvider } from "react-router-dom";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="dincharya-theme">
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

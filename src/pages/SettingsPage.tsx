
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

const SettingsPage = () => {
  const { user } = useAuth();
  const [name, setName] = useState("User");
  const [email, setEmail] = useState(user?.email || "");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [theme, setTheme] = useState("system");

  // Load user settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      if (settings.name) setName(settings.name);
      if (settings.emailNotifications !== undefined) setEmailNotifications(settings.emailNotifications);
      if (settings.taskReminders !== undefined) setTaskReminders(settings.taskReminders);
      if (settings.weeklyDigest !== undefined) setWeeklyDigest(settings.weeklyDigest);
      if (settings.theme) setTheme(settings.theme);
    }
  }, []);

  const saveSettings = (settingsObj: any) => {
    const currentSettings = localStorage.getItem('userSettings') 
      ? JSON.parse(localStorage.getItem('userSettings') || '{}') 
      : {};
    
    const newSettings = {
      ...currentSettings,
      ...settingsObj
    };
    
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
  };

  const handleProfileSave = async () => {
    saveSettings({ name });
    
    // If user is authenticated, update their metadata
    if (user) {
      try {
        const { error } = await supabase.auth.updateUser({
          data: { 
            full_name: name 
          }
        });
        
        if (error) throw error;
      } 
      catch (error: any) {
        toast({
          title: "Error updating profile",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
    }
    
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated",
    });
  };

  const handleNotificationsSave = () => {
    saveSettings({
      emailNotifications,
      taskReminders,
      weeklyDigest
    });
    
    toast({
      title: "Notification preferences updated",
      description: "Your notification settings have been saved",
    });
  };

  const handlePasswordChange = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to change your password",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Your password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword 
      });
      
      if (error) throw error;
      
      toast({
        title: "Password changed",
        description: "Your password has been updated successfully",
      });
      
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } 
    catch (error: any) {
      toast({
        title: "Error changing password",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    saveSettings({ theme: newTheme });
    
    // Apply theme to document
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else if (newTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    
    toast({
      title: "Theme updated",
      description: "Your theme preference has been saved",
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-dincharya-text dark:text-white mb-6">Settings</h1>
      
      <Tabs defaultValue="profile" className="mb-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Enter your name" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="Enter your email" 
                  type="email"
                  disabled={!!user} // Disable if logged in with Supabase
                />
                {user && (
                  <p className="text-xs text-muted-foreground">
                    Email address cannot be changed for authenticated accounts.
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleProfileSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive emails about your account activity
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="task-reminders">Task Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified before your tasks are due
                  </p>
                </div>
                <Switch
                  id="task-reminders"
                  checked={taskReminders}
                  onCheckedChange={setTaskReminders}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="weekly-digest">Weekly Digest</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive a summary of your weekly activity
                  </p>
                </div>
                <Switch
                  id="weekly-digest"
                  checked={weeklyDigest}
                  onCheckedChange={setWeeklyDigest}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleNotificationsSave}>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="password" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  You need to be signed in to change your password
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handlePasswordChange} disabled={!user}>Change Password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how the application looks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-base">Theme</Label>
                  <div className="grid grid-cols-3 gap-4 mt-3">
                    <Button 
                      variant={theme === "light" ? "default" : "outline"} 
                      className="justify-start"
                      onClick={() => handleThemeChange("light")}
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full border mr-2 bg-background">
                        <span className="h-2.5 w-2.5 rounded-full bg-foreground"></span>
                      </span>
                      Light
                    </Button>
                    <Button 
                      variant={theme === "dark" ? "default" : "outline"} 
                      className="justify-start"
                      onClick={() => handleThemeChange("dark")}
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full border mr-2 bg-black">
                        <span className="h-2.5 w-2.5 rounded-full bg-white"></span>
                      </span>
                      Dark
                    </Button>
                    <Button 
                      variant={theme === "system" ? "default" : "outline"} 
                      className="justify-start"
                      onClick={() => handleThemeChange("system")}
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full border mr-2 bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-100 to-gray-900">
                      </span>
                      System
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;

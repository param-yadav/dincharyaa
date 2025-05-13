
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

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

  const handleProfileSave = () => {
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated",
    });
  };

  const handleNotificationsSave = () => {
    toast({
      title: "Notification preferences updated",
      description: "Your notification settings have been saved",
    });
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Password changed",
      description: "Your password has been updated successfully",
    });
    
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
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
            </CardContent>
            <CardFooter>
              <Button onClick={handlePasswordChange}>Change Password</Button>
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
                    <Button variant="outline" className="justify-start">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full border mr-2 bg-background">
                        <span className="h-2.5 w-2.5 rounded-full bg-foreground"></span>
                      </span>
                      Light
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full border mr-2 bg-black">
                        <span className="h-2.5 w-2.5 rounded-full bg-white"></span>
                      </span>
                      Dark
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full border mr-2 bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-100 to-gray-900">
                      </span>
                      System
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;

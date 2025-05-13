
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, UserPlus, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const AuthPage = () => {
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (activeTab === "login") {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dincharya-background pattern-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-dincharya-text dark:text-white">Dincharya</h1>
          <p className="text-dincharya-text/70 dark:text-white/70">Your daily task management app</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>
              {activeTab === "login" 
                ? "Sign in to your account to continue" 
                : "Create an account to get started"}
            </CardDescription>
          </CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4 mx-4">
              <TabsTrigger value="login" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" /> Login
              </TabsTrigger>
              <TabsTrigger value="signup" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" /> Sign Up
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link to="/auth/forgot-password" className="text-xs text-dincharya-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full flex items-center gap-2"
                    disabled={isLoading}
                  >
                    <Mail className="h-4 w-4" />
                    Sign in with Google
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Password must be at least 6 characters long
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full flex items-center gap-2"
                    disabled={isLoading}
                  >
                    <Mail className="h-4 w-4" />
                    Sign up with Google
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
        
        <div className="text-center mt-4">
          <Link to="/" className="text-dincharya-primary hover:underline text-sm">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

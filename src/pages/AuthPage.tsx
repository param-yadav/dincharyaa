
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Lock, Check, Eye, EyeOff, Github } from "lucide-react";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (activeTab === "signup" && form.password !== form.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      // This would be connected to Supabase or another auth provider
      setTimeout(() => {
        toast({
          title: activeTab === "signin" ? "Signed in!" : "Account created!",
          description: "This is just a demo. Authentication will be implemented later.",
        });
        setIsLoading(false);
        navigate("/tasks");
      }, 1500);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    toast({
      title: "Google Sign In",
      description: "Google Sign In will be implemented when connected to Supabase.",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-dincharya-background pattern-bg">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <img 
              src="/lovable-uploads/7b9e64ad-467b-4f8e-b543-70e78e2ceb8a.png" 
              alt="Dincharya" 
              className="h-12 w-auto"
            />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-dincharya-text">
            Welcome to Dincharya
          </h2>
          <p className="mt-2 text-dincharya-text/70">
            Your daily task management companion
          </p>
        </div>

        <Card className="border-dincharya-muted/30 bg-white/90 backdrop-blur-sm dark:bg-dincharya-text/90 shadow-lg">
          <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as "signin" | "signup")}>
            <CardHeader>
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent>
              <TabsContent value="signin">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dincharya-text/50" />
                      <Input 
                        name="email"
                        type="email"
                        placeholder="Email"
                        className="pl-10"
                        required
                        value={form.email}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dincharya-text/50" />
                      <Input 
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="pl-10 pr-10"
                        required
                        value={form.password}
                        onChange={handleInputChange}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-dincharya-text/50" />
                        ) : (
                          <Eye className="h-4 w-4 text-dincharya-text/50" />
                        )}
                      </button>
                    </div>
                    <div className="text-right">
                      <a href="#" className="text-xs text-dincharya-primary hover:underline">
                        Forgot password?
                      </a>
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-dincharya-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      name="firstName"
                      placeholder="First Name"
                      required
                      value={form.firstName}
                      onChange={handleInputChange}
                    />
                    <Input 
                      name="lastName"
                      placeholder="Last Name"
                      required
                      value={form.lastName}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dincharya-text/50" />
                    <Input 
                      name="email"
                      type="email"
                      placeholder="Email"
                      className="pl-10"
                      required
                      value={form.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dincharya-text/50" />
                    <Input 
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="pl-10 pr-10"
                      required
                      value={form.password}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-dincharya-text/50" />
                      ) : (
                        <Eye className="h-4 w-4 text-dincharya-text/50" />
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dincharya-text/50" />
                    <Input 
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      className="pl-10 pr-10"
                      required
                      value={form.confirmPassword}
                      onChange={handleInputChange}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-dincharya-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Sign Up"}
                  </Button>
                </form>
              </TabsContent>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 pt-0">
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-dincharya-muted/30" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white dark:bg-dincharya-text px-2 text-dincharya-text/60 dark:text-white/60">
                    or continue with
                  </span>
                </div>
              </div>
              
              <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="h-5 w-5 mr-2" alt="Google" />
                Google
              </Button>
            </CardFooter>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;

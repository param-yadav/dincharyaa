import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Play, Pause, RotateCcw, Clock, Timer as TimerIcon, Save } from "lucide-react";
import { TimerHistory } from "@/components/timer/TimerHistory";
import { Separator } from "@/components/ui/separator";

const TimerPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("timer");
  const [timerRunning, setTimerRunning] = useState(false);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [time, setTime] = useState(0); // seconds
  const [timerDuration, setTimerDuration] = useState(""); // HH:MM:SS format
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    if (timerRunning || stopwatchRunning) {
      toast({
        title: "Timer is running",
        description: "Please stop the current timer before switching tabs",
        variant: "destructive"
      });
      return;
    }
    
    setActiveTab(value);
    resetTimer();
  };
  
  // Parse timer input to seconds
  const parseTimerInput = () => {
    const parts = timerDuration.split(":");
    let seconds = 0;
    
    if (parts.length === 3) {
      // HH:MM:SS
      seconds = 
        parseInt(parts[0], 10) * 3600 + 
        parseInt(parts[1], 10) * 60 + 
        parseInt(parts[2], 10);
    } else if (parts.length === 2) {
      // MM:SS
      seconds = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    } else {
      // SS
      seconds = parseInt(parts[0], 10);
    }
    
    return isNaN(seconds) ? 0 : seconds;
  };
  
  // Format seconds to HH:MM:SS
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };
  
  // Start timer
  const startTimer = () => {
    if (activeTab === "timer") {
      const duration = parseTimerInput();
      if (duration <= 0) {
        toast({
          title: "Invalid duration",
          description: "Please set a valid timer duration",
          variant: "destructive"
        });
        return;
      }
      
      setTime(duration);
      setTimerRunning(true);
      
      const endTime = Date.now() + duration * 1000;
      
      intervalRef.current = window.setInterval(() => {
        const remaining = Math.max(0, Math.round((endTime - Date.now()) / 1000));
        setTime(remaining);
        
        if (remaining <= 0) {
          clearInterval(intervalRef.current!);
          setTimerRunning(false);
          
          // Play notification sound
          const audio = new Audio("/notification.mp3");
          audio.play().catch(e => console.error("Error playing sound:", e));
          
          // Show browser notification
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("Timer Completed", {
              body: "Your timer has finished!",
              icon: "/favicon.ico"
            });
          }
          
          toast({
            title: "Timer completed!",
            description: "Your timer has finished"
          });
        }
      }, 100);
    } else {
      // Stopwatch
      setStopwatchRunning(true);
      startTimeRef.current = Date.now() - time * 1000; // Account for paused time
      
      intervalRef.current = window.setInterval(() => {
        setTime(Math.floor((Date.now() - startTimeRef.current!) / 1000));
      }, 100);
    }
  };
  
  // Pause timer
  const pauseTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (activeTab === "timer") {
      setTimerRunning(false);
    } else {
      setStopwatchRunning(false);
    }
  };
  
  // Reset timer
  const resetTimer = () => {
    pauseTimer();
    
    if (activeTab === "timer") {
      setTime(parseTimerInput());
    } else {
      setTime(0);
    }
    
    startTimeRef.current = null;
  };
  
  // Handle timer input change
  const handleTimerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;
    
    // Only allow digits and colons
    input = input.replace(/[^\d:]/g, '');
    
    // Format input as HH:MM:SS
    const parts = input.split(':');
    let formatted = "";
    
    if (parts.length > 3) {
      // Too many parts, ignore extras
      formatted = parts.slice(0, 3).join(':');
    } else if (parts.length === 3) {
      // HH:MM:SS
      const hours = parts[0].slice(0, 2).padStart(2, '0');
      const minutes = parts[1].slice(0, 2).padStart(2, '0');
      const seconds = parts[2].slice(0, 2).padStart(2, '0');
      formatted = `${hours}:${minutes}:${seconds}`;
    } else if (parts.length === 2) {
      // MM:SS
      const minutes = parts[0].slice(0, 2).padStart(2, '0');
      const seconds = parts[1].slice(0, 2).padStart(2, '0');
      formatted = `${minutes}:${seconds}`;
    } else {
      // SS
      formatted = parts[0].slice(0, 2);
    }
    
    setTimerDuration(formatted);
  };
  
  // Save timer session to database
  const saveSession = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save your timer session",
        variant: "destructive"
      });
      return;
    }
    
    if (time <= 0) {
      toast({
        title: "No time recorded",
        description: "Please use the timer before saving a session",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setSaving(true);
      
      const { data, error } = await supabase
        .from('timer_sessions')
        .insert({
          user_id: user.id,
          duration: time,
          type: activeTab,
          notes: notes.trim() || null
        })
        .select()
        .single();
        
      if (error) throw error;
      
      toast({
        title: "Session saved",
        description: "Your timer session has been saved"
      });
      
      // Reset notes but keep the timer as is
      setNotes("");
    } catch (error) {
      console.error("Error saving timer session:", error);
      toast({
        title: "Failed to save session",
        description: "There was an error saving your timer session",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      toast({
        title: "Enable notifications",
        description: "Allow notifications to be alerted when your timer completes",
        action: (
          <Button 
            variant="outline" 
            onClick={() => {
              Notification.requestPermission().then(result => {
                if (result === "granted") {
                  toast({
                    title: "Notifications enabled",
                    description: "You'll receive alerts when your timer completes"
                  });
                }
              });
            }}
          >
            Allow
          </Button>
        )
      });
    }
  }, [toast]);

  // Set up the timer value when component mounts
  useEffect(() => {
    setTime(parseTimerInput());
  }, [timerDuration]);
  
  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Timer & Stopwatch</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Timer/Stopwatch Card */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <Tabs 
                value={activeTab} 
                onValueChange={handleTabChange} 
                className="w-full"
              >
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="timer" className="flex items-center space-x-2">
                    <TimerIcon className="h-4 w-4" />
                    <span>Timer</span>
                  </TabsTrigger>
                  <TabsTrigger value="stopwatch" className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Stopwatch</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="timer" className="m-0">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="timer-duration">Duration (HH:MM:SS)</Label>
                      <Input 
                        id="timer-duration" 
                        value={timerDuration}
                        onChange={handleTimerInputChange}
                        placeholder="00:25:00"
                        className="text-lg text-center"
                        disabled={timerRunning}
                      />
                    </div>
                    
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="text-5xl font-bold mb-6">
                        {formatTime(time)}
                      </div>
                      
                      <div className="flex space-x-3">
                        {!timerRunning ? (
                          <Button 
                            size="lg" 
                            onClick={startTimer}
                            className="bg-amber-600 hover:bg-amber-700"
                          >
                            <Play className="h-5 w-5 mr-2" />
                            Start
                          </Button>
                        ) : (
                          <Button 
                            size="lg" 
                            variant="outline" 
                            onClick={pauseTimer}
                          >
                            <Pause className="h-5 w-5 mr-2" />
                            Pause
                          </Button>
                        )}
                        
                        <Button 
                          size="lg" 
                          variant="outline" 
                          onClick={resetTimer}
                        >
                          <RotateCcw className="h-5 w-5 mr-2" />
                          Reset
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="stopwatch" className="m-0">
                  <div className="flex flex-col items-center justify-center py-14">
                    <div className="text-6xl font-bold mb-8">
                      {formatTime(time)}
                    </div>
                    
                    <div className="flex space-x-3">
                      {!stopwatchRunning ? (
                        <Button 
                          size="lg" 
                          onClick={startTimer}
                          className="bg-amber-600 hover:bg-amber-700"
                        >
                          <Play className="h-5 w-5 mr-2" />
                          Start
                        </Button>
                      ) : (
                        <Button 
                          size="lg" 
                          variant="outline" 
                          onClick={pauseTimer}
                      >
                        <Pause className="h-5 w-5 mr-2" />
                        Pause
                      </Button>
                    )}
                    
                    <Button 
                      size="lg" 
                      variant="outline" 
                      onClick={resetTimer}
                    >
                      <RotateCcw className="h-5 w-5 mr-2" />
                      Reset
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardHeader>
          
          <CardFooter className="flex flex-col">
            <Separator className="mb-4" />
            
            <div className="w-full space-y-3">
              <Label htmlFor="timer-notes">Notes (optional)</Label>
              <Textarea 
                id="timer-notes" 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What are you timing? Add notes here..."
                rows={3}
              />
              
              <Button 
                className="w-full bg-amber-600 hover:bg-amber-700"
                onClick={saveSession}
                disabled={saving || time === 0}
              >
                {saving ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Session
                  </>
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
      
      {/* History Card */}
      <div className="md:col-span-1">
        <TimerHistory />
      </div>
    </div>
  );
};

export default TimerPage;

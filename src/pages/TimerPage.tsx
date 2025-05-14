
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayCircle, PauseCircle, RefreshCcw, Clock, Watch } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const TimerPage = () => {
  const [activeTab, setActiveTab] = useState("timer");
  const [timerTime, setTimerTime] = useState<number>(25 * 60); // 25 minutes in seconds
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [timerRemaining, setTimerRemaining] = useState<number>(25 * 60);
  
  const [stopwatchTime, setStopwatchTime] = useState<number>(0);
  const [stopwatchRunning, setStopwatchRunning] = useState<boolean>(false);
  
  const timerInterval = useRef<number | null>(null);
  const stopwatchInterval = useRef<number | null>(null);
  
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours > 0 ? `${hours.toString().padStart(2, '0')}:` : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const handleTimerStart = () => {
    if (timerRunning) return;
    
    setTimerRunning(true);
    timerInterval.current = window.setInterval(() => {
      setTimerRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerInterval.current!);
          setTimerRunning(false);
          toast({
            title: "Timer Completed",
            description: "Your timer has finished!"
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  const handleTimerPause = () => {
    if (!timerRunning) return;
    
    clearInterval(timerInterval.current!);
    setTimerRunning(false);
  };
  
  const handleTimerReset = () => {
    clearInterval(timerInterval.current!);
    setTimerRunning(false);
    setTimerRemaining(timerTime);
  };
  
  const handleTimerChange = (minutes: number) => {
    const newTime = minutes * 60;
    setTimerTime(newTime);
    setTimerRemaining(newTime);
    
    // If timer is running, reset it
    if (timerRunning) {
      clearInterval(timerInterval.current!);
      setTimerRunning(false);
    }
  };
  
  const handleStopwatchStart = () => {
    if (stopwatchRunning) return;
    
    setStopwatchRunning(true);
    stopwatchInterval.current = window.setInterval(() => {
      setStopwatchTime(prev => prev + 1);
    }, 1000);
  };
  
  const handleStopwatchPause = () => {
    if (!stopwatchRunning) return;
    
    clearInterval(stopwatchInterval.current!);
    setStopwatchRunning(false);
  };
  
  const handleStopwatchReset = () => {
    clearInterval(stopwatchInterval.current!);
    setStopwatchRunning(false);
    setStopwatchTime(0);
  };
  
  // Clean up intervals when component unmounts
  useEffect(() => {
    return () => {
      if (timerInterval.current) clearInterval(timerInterval.current);
      if (stopwatchInterval.current) clearInterval(stopwatchInterval.current);
    };
  }, []);
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-dincharya-text dark:text-white mb-6">Time Tools</h1>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
          <TabsTrigger value="timer" className="flex gap-2 items-center">
            <Clock className="h-4 w-4" />
            <span>Timer</span>
          </TabsTrigger>
          <TabsTrigger value="stopwatch" className="flex gap-2 items-center">
            <Watch className="h-4 w-4" />
            <span>Stopwatch</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="timer" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Countdown Timer</CardTitle>
              <CardDescription>
                Set a timer for focused work or breaks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center">
                <div className="text-6xl font-bold mb-8">
                  {formatTime(timerRemaining)}
                </div>
                
                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => handleTimerChange(5)}
                    className={timerTime === 5 * 60 ? "bg-primary/20" : ""}
                  >
                    5m
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleTimerChange(15)}
                    className={timerTime === 15 * 60 ? "bg-primary/20" : ""}
                  >
                    15m
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleTimerChange(25)}
                    className={timerTime === 25 * 60 ? "bg-primary/20" : ""}
                  >
                    25m
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleTimerChange(50)}
                    className={timerTime === 50 * 60 ? "bg-primary/20" : ""}
                  >
                    50m
                  </Button>
                </div>
                
                <div className="mt-6 flex items-center gap-2">
                  <Input
                    type="number"
                    min="1"
                    max="180"
                    className="w-24"
                    placeholder="Custom"
                    onChange={(e) => handleTimerChange(parseInt(e.target.value) || 25)}
                  />
                  <span className="text-sm text-muted-foreground">minutes</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center gap-4">
              {!timerRunning ? (
                <Button onClick={handleTimerStart} className="gap-2" disabled={timerRemaining === 0}>
                  <PlayCircle className="h-5 w-5" />
                  Start
                </Button>
              ) : (
                <Button onClick={handleTimerPause} className="gap-2">
                  <PauseCircle className="h-5 w-5" />
                  Pause
                </Button>
              )}
              <Button variant="outline" onClick={handleTimerReset} className="gap-2">
                <RefreshCcw className="h-4 w-4" />
                Reset
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="stopwatch" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Stopwatch</CardTitle>
              <CardDescription>
                Track how much time you spend on a task
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="text-6xl font-bold my-12">
                {formatTime(stopwatchTime)}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center gap-4">
              {!stopwatchRunning ? (
                <Button onClick={handleStopwatchStart} className="gap-2">
                  <PlayCircle className="h-5 w-5" />
                  Start
                </Button>
              ) : (
                <Button onClick={handleStopwatchPause} className="gap-2">
                  <PauseCircle className="h-5 w-5" />
                  Pause
                </Button>
              )}
              <Button variant="outline" onClick={handleStopwatchReset} className="gap-2">
                <RefreshCcw className="h-4 w-4" />
                Reset
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TimerPage;


import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, RotateCcw } from "lucide-react";

const CountdownTimer = () => {
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isSetup, setIsSetup] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setIsRunning(false);
            setIsSetup(true);
            // Play notification sound or show alert
            alert("Time's up!");
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleStart = () => {
    if (isSetup) {
      const totalSeconds = minutes * 60 + seconds;
      setTimeLeft(totalSeconds);
      setIsSetup(false);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsSetup(true);
    setTimeLeft(0);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const totalTime = minutes * 60 + seconds;
    return totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;
  };

  return (
    <Card className="bg-white dark:bg-dincharya-text/90 border border-dincharya-border/20 mb-8 max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl text-center text-dincharya-text dark:text-white">
          Countdown Timer
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isSetup ? (
          <div className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <Label htmlFor="minutes" className="text-dincharya-text dark:text-white">Minutes</Label>
                <Input 
                  id="minutes" 
                  type="number" 
                  min="0" 
                  max="59" 
                  value={minutes} 
                  onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                  className="bg-white dark:bg-dincharya-muted/20 text-dincharya-text dark:text-white border-dincharya-border/30"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="seconds" className="text-dincharya-text dark:text-white">Seconds</Label>
                <Input 
                  id="seconds" 
                  type="number" 
                  min="0" 
                  max="59" 
                  value={seconds} 
                  onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
                  className="bg-white dark:bg-dincharya-muted/20 text-dincharya-text dark:text-white border-dincharya-border/30"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="relative w-48 h-48 mx-auto mb-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-4xl font-bold text-dincharya-primary">{formatTime(timeLeft)}</div>
              </div>
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth="8"
                  className="dark:stroke-dincharya-muted/20"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#B84C14"
                  strokeWidth="8"
                  strokeDasharray="282.7"
                  strokeDashoffset={282.7 - (282.7 * getProgressPercentage()) / 100}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        )}
        
        <div className="flex justify-center gap-2 mt-6">
          {!isRunning ? (
            <Button 
              onClick={handleStart} 
              className="bg-dincharya-primary hover:bg-dincharya-primary/90 text-white"
            >
              <Play className="w-4 h-4 mr-2" /> Start
            </Button>
          ) : (
            <Button 
              onClick={handlePause} 
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              <Pause className="w-4 h-4 mr-2" /> Pause
            </Button>
          )}
          <Button 
            onClick={handleReset} 
            variant="outline"
            className="border-dincharya-border/30 text-dincharya-text dark:text-white"
          >
            <RotateCcw className="w-4 h-4 mr-2" /> Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CountdownTimer;

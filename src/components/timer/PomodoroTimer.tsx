import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Play, Pause, Square, Settings, Coffee, Brain } from "lucide-react";
import { useTimerSessions } from "@/hooks/use-timer-sessions";
import { toast } from "@/hooks/use-toast";
import CountdownTimer from "./CountdownTimer";

type TimerType = 'pomodoro' | 'short-break' | 'long-break';

const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [timerType, setTimerType] = useState<TimerType>('pomodoro');
  const [sessions, setSessions] = useState(0);
  const [notes, setNotes] = useState("");
  const [settings, setSettings] = useState({
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
  });
  const [showSettings, setShowSettings] = useState(false);
  
  const { createSession } = useTimerSessions();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const timerConfigs = {
    pomodoro: { duration: settings.pomodoro * 60, label: 'Focus Time', icon: Brain, color: 'bg-red-500' },
    'short-break': { duration: settings.shortBreak * 60, label: 'Short Break', icon: Coffee, color: 'bg-green-500' },
    'long-break': { duration: settings.longBreak * 60, label: 'Long Break', icon: Coffee, color: 'bg-blue-500' },
  };

  const currentConfig = timerConfigs[timerType];
  const progress = ((currentConfig.duration - timeLeft) / currentConfig.duration) * 100;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = async () => {
    setIsRunning(false);
    
    // Save session if it was a pomodoro
    if (timerType === 'pomodoro' && startTimeRef.current) {
      const duration = Date.now() - startTimeRef.current;
      await createSession({
        duration: Math.round(duration / 1000),
        type: 'pomodoro',
        notes: notes.trim() || undefined,
      });
      setSessions(prev => prev + 1);
    }

    // Play notification sound (if supported)
    try {
      const audio = new Audio('/notification.mp3');
      audio.play().catch(() => {}); // Ignore if audio fails
    } catch (error) {
      // Fallback to system notification
    }

    // Show notification
    toast({
      title: `${currentConfig.label} Complete!`,
      description: timerType === 'pomodoro' 
        ? "Great work! Time for a break." 
        : "Break's over! Ready to focus?",
    });

    // Auto-switch to next timer type
    if (timerType === 'pomodoro') {
      const nextType = sessions % 4 === 3 ? 'long-break' : 'short-break';
      switchTimerType(nextType);
    } else {
      switchTimerType('pomodoro');
    }
  };

  const startTimer = () => {
    setIsRunning(true);
    startTimeRef.current = Date.now() - (currentConfig.duration - timeLeft) * 1000;
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(currentConfig.duration);
    startTimeRef.current = null;
  };

  const switchTimerType = (type: TimerType) => {
    setTimerType(type);
    setTimeLeft(timerConfigs[type].duration);
    setIsRunning(false);
    startTimeRef.current = null;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const updateSettings = () => {
    setTimeLeft(timerConfigs[timerType].duration);
    setShowSettings(false);
    toast({
      title: "Settings updated",
      description: "Timer durations have been updated",
    });
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Timer Type Selector */}
      <div className="flex justify-center space-x-2">
        {(Object.keys(timerConfigs) as TimerType[]).map((type) => {
          const config = timerConfigs[type];
          const Icon = config.icon;
          return (
            <Button
              key={type}
              variant={timerType === type ? "default" : "outline"}
              size="sm"
              onClick={() => switchTimerType(type)}
              className={timerType === type ? config.color : ''}
            >
              <Icon className="w-4 h-4 mr-1" />
              {config.label}
            </Button>
          );
        })}
      </div>

      {/* Main Timer Card */}
      <Card className="bg-gradient-to-br from-white to-gray-50 shadow-xl border-0">
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-800">
              {currentConfig.label}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-sm text-gray-600">
            Session {sessions + 1} • {sessions} completed today
          </div>
        </CardHeader>
        
        <CardContent className="text-center space-y-6">
          {/* Timer Display */}
          <div className="relative">
            <div className="text-6xl font-mono font-bold text-gray-800 mb-4">
              {formatTime(timeLeft)}
            </div>
            <Progress 
              value={progress} 
              className="h-3 bg-gray-200"
            />
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center space-x-4">
            {!isRunning ? (
              <Button
                onClick={startTimer}
                size="lg"
                className={`${currentConfig.color} hover:opacity-90 text-white`}
              >
                <Play className="w-5 h-5 mr-2" />
                Start
              </Button>
            ) : (
              <Button
                onClick={pauseTimer}
                size="lg"
                variant="outline"
              >
                <Pause className="w-5 h-5 mr-2" />
                Pause
              </Button>
            )}
            
            <Button
              onClick={resetTimer}
              size="lg"
              variant="outline"
            >
              <Square className="w-5 h-5 mr-2" />
              Reset
            </Button>
          </div>

          {/* Session Notes */}
          {timerType === 'pomodoro' && (
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                Session Notes (optional)
              </Label>
              <Textarea
                id="notes"
                placeholder="What are you working on?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="resize-none"
                rows={2}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Settings Panel */}
      {showSettings && (
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Timer Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="pomodoro">Pomodoro (min)</Label>
                <Input
                  id="pomodoro"
                  type="number"
                  value={settings.pomodoro}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    pomodoro: parseInt(e.target.value) || 25
                  }))}
                  min="1"
                  max="60"
                />
              </div>
              <div>
                <Label htmlFor="short-break">Short Break (min)</Label>
                <Input
                  id="short-break"
                  type="number"
                  value={settings.shortBreak}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    shortBreak: parseInt(e.target.value) || 5
                  }))}
                  min="1"
                  max="30"
                />
              </div>
              <div>
                <Label htmlFor="long-break">Long Break (min)</Label>
                <Input
                  id="long-break"
                  type="number"
                  value={settings.longBreak}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    longBreak: parseInt(e.target.value) || 15
                  }))}
                  min="1"
                  max="60"
                />
              </div>
            </div>
            <Button onClick={updateSettings} className="w-full">
              Save Settings
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PomodoroTimer;

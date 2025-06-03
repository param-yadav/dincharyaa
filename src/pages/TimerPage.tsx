
import React from "react";
import PomodoroTimer from "@/components/timer/PomodoroTimer";
import { TimerHistory } from "@/components/timer/TimerHistory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, BarChart3 } from "lucide-react";

const TimerPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dincharya-background to-dincharya-muted/20 dark:from-dincharya-text dark:to-dincharya-muted/10">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-dincharya-text dark:text-white mb-2">Focus Timer</h1>
          <p className="text-gray-600 dark:text-gray-400">Stay productive with the Pomodoro technique</p>
        </div>

        <Tabs defaultValue="timer" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-white dark:bg-dincharya-text/90">
            <TabsTrigger value="timer" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Timer
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timer">
            <PomodoroTimer />
          </TabsContent>

          <TabsContent value="history">
            <TimerHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TimerPage;

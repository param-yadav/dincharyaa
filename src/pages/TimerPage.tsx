
import React from "react";
import PomodoroTimer from "@/components/timer/PomodoroTimer";
import { TimerHistory } from "@/components/timer/TimerHistory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, BarChart3 } from "lucide-react";

const TimerPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Focus Timer</h1>
          <p className="text-gray-600">Stay productive with the Pomodoro technique</p>
        </div>

        <Tabs defaultValue="timer" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
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

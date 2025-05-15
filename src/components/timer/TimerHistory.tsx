
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Clock, Trash2 } from "lucide-react";

export interface TimerSession {
  id: string;
  user_id: string;
  duration: number; // in seconds
  type: "timer" | "stopwatch";
  notes?: string;
  created_at: string;
}

export function TimerHistory() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<TimerSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  
  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);
  
  const fetchSessions = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('timer_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setSessions(data as TimerSession[] || []);
    } catch (error) {
      console.error("Error fetching timer sessions:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!user) return;
    
    try {
      setDeleteLoading(id);
      
      const { error } = await supabase
        .from('timer_sessions')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setSessions(sessions.filter(session => session.id !== id));
    } catch (error) {
      console.error("Error deleting timer session:", error);
    } finally {
      setDeleteLoading(null);
    }
  };
  
  // Format seconds to hh:mm:ss
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
          <CardDescription>Your timer session history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-4">
            <Clock className="h-8 w-8 animate-pulse text-gray-300" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>History</CardTitle>
        <CardDescription>Your timer session history</CardDescription>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-8">
            <Clock className="h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-medium mb-1">No history yet</h3>
            <p className="text-sm text-muted-foreground">
              Your completed timer sessions will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex-1">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-medium">
                      {formatTime(session.duration)}
                    </span>
                    <span className="ml-3 text-xs px-2 py-0.5 bg-gray-200 rounded-full">
                      {session.type === "timer" ? "Timer" : "Stopwatch"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {format(new Date(session.created_at), "MMM d, yyyy 'at' h:mm a")}
                  </div>
                  {session.notes && (
                    <div className="text-sm mt-1">
                      {session.notes}
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-500 hover:text-red-500"
                  onClick={() => handleDelete(session.id)}
                  disabled={deleteLoading === session.id}
                >
                  {deleteLoading === session.id ? (
                    <Clock className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

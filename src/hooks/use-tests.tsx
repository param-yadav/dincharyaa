
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Test {
  id: string;
  template_id: string;
  user_id: string;
  test_date: string;
  status: "not_started" | "in_progress" | "completed";
  started_at?: string;
  completed_at?: string;
  created_at: string;
  template?: {
    name: string;
    description?: string;
    test_type: "daily" | "custom";
    total_questions: number;
    total_marks: number;
    time_limit_minutes?: number;
  };
}

export interface TestAttempt {
  id: string;
  test_id: string;
  user_id: string;
  started_at: string;
  completed_at?: string;
  total_score: number;
  total_correct: number;
  total_incorrect: number;
  total_unanswered: number;
  time_taken_minutes: number;
}

export const useUserTests = () => {
  return useQuery({
    queryKey: ["user-tests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tests")
        .select(`
          *,
          test_templates (
            name,
            description,
            test_type,
            total_questions,
            total_marks,
            time_limit_minutes
          )
        `)
        .order("test_date", { ascending: false });

      if (error) throw error;
      return data as Test[];
    },
  });
};

export const useCreateTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ templateId, testDate }: { templateId: string; testDate: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("tests")
        .insert({
          template_id: templateId,
          user_id: user.id,
          test_date: testDate,
          status: "not_started",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-tests"] });
      toast({
        title: "Success",
        description: "Test scheduled successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useTestAttempts = (testId?: string) => {
  return useQuery({
    queryKey: ["test-attempts", testId],
    queryFn: async () => {
      if (!testId) return [];
      
      const { data, error } = await supabase
        .from("test_attempts")
        .select("*")
        .eq("test_id", testId)
        .order("started_at", { ascending: false });

      if (error) throw error;
      return data as TestAttempt[];
    },
    enabled: !!testId,
  });
};

export const useUserTestAnalytics = (period: "week" | "month" | "year" = "month") => {
  return useQuery({
    queryKey: ["test-analytics", period],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase.rpc("get_user_test_analytics", {
        p_user_id: user.id,
        p_period: period,
      });

      if (error) throw error;
      return data;
    },
  });
};

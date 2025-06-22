
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface TestQuestion {
  id: string;
  section_id: string;
  question_text: string;
  question_type: "multiple_choice" | "true_false";
  option_a?: string;
  option_b?: string;
  option_c?: string;
  option_d?: string;
  correct_answer: string;
  explanation?: string;
  difficulty_level: number;
  question_order: number;
}

export interface TestAnswer {
  id: string;
  attempt_id: string;
  question_id: string;
  user_answer?: string;
  is_correct: boolean;
  marks_awarded: number;
  time_taken_seconds: number;
}

export const useTestQuestions = (templateId?: string) => {
  return useQuery({
    queryKey: ["test-questions", templateId],
    queryFn: async () => {
      if (!templateId) return [];

      const { data, error } = await supabase
        .from("test_questions")
        .select(`
          *,
          test_sections!inner (
            template_id,
            name,
            section_order
          )
        `)
        .eq("test_sections.template_id", templateId)
        .order("test_sections.section_order")
        .order("question_order");

      if (error) throw error;
      return data as (TestQuestion & { test_sections: { name: string; section_order: number } })[];
    },
    enabled: !!templateId,
  });
};

export const useStartTestAttempt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (testId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Create test attempt
      const { data: attempt, error: attemptError } = await supabase
        .from("test_attempts")
        .insert({
          test_id: testId,
          user_id: user.id,
        })
        .select()
        .single();

      if (attemptError) throw attemptError;

      // Update test status
      const { error: testError } = await supabase
        .from("tests")
        .update({ 
          status: "in_progress",
          started_at: new Date().toISOString()
        })
        .eq("id", testId);

      if (testError) throw testError;

      return attempt;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-tests"] });
      queryClient.invalidateQueries({ queryKey: ["test-attempts"] });
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

export const useSubmitTestAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      attemptId,
      questionId,
      userAnswer,
      correctAnswer,
      timeTaken,
      marksPerQuestion,
    }: {
      attemptId: string;
      questionId: string;
      userAnswer: string;
      correctAnswer: string;
      timeTaken: number;
      marksPerQuestion: number;
    }) => {
      const isCorrect = userAnswer === correctAnswer;
      const marksAwarded = isCorrect ? marksPerQuestion : 0;

      const { data, error } = await supabase
        .from("test_answers")
        .upsert({
          attempt_id: attemptId,
          question_id: questionId,
          user_answer: userAnswer,
          is_correct: isCorrect,
          marks_awarded: marksAwarded,
          time_taken_seconds: timeTaken,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["test-answers"] });
    },
  });
};

export const useCompleteTestAttempt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (attemptId: string) => {
      // Calculate final score
      const { data: score, error: scoreError } = await supabase.rpc("calculate_test_score", {
        p_attempt_id: attemptId,
      });

      if (scoreError) throw scoreError;

      // Update test status to completed
      const { data: attempt } = await supabase
        .from("test_attempts")
        .select("test_id")
        .eq("id", attemptId)
        .single();

      if (attempt) {
        await supabase
          .from("tests")
          .update({ status: "completed" })
          .eq("id", attempt.test_id);
      }

      return score;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-tests"] });
      queryClient.invalidateQueries({ queryKey: ["test-attempts"] });
      queryClient.invalidateQueries({ queryKey: ["test-analytics"] });
      toast({
        title: "Test Completed",
        description: "Your test has been submitted successfully",
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

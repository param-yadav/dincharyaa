
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface ManualTestEntry {
  id: string;
  user_id: string;
  test_name: string;
  test_date: string;
  total_marks: number;
  subjects: SubjectScore[];
  created_at: string;
}

export interface SubjectScore {
  id: string;
  test_entry_id: string;
  subject_name: string;
  correct_answers: number;
  wrong_answers: number;
  not_attempted: number;
  marks_per_question: number;
  total_questions: number;
  scored_marks: number;
}

export const useManualTests = () => {
  return useQuery({
    queryKey: ["manual-tests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("manual_test_entries" as any)
        .select(`
          *,
          subject_scores (*)
        `)
        .order("test_date", { ascending: false });

      if (error) throw error;
      return data as ManualTestEntry[];
    },
  });
};

export const useCreateManualTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (testData: {
      test_name: string;
      test_date: string;
      subjects: Array<{
        subject_name: string;
        correct_answers: number;
        wrong_answers: number;
        not_attempted: number;
        marks_per_question: number;
      }>;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Calculate total marks
      const total_marks = testData.subjects.reduce((sum, subject) => {
        return sum + (subject.correct_answers * subject.marks_per_question);
      }, 0);

      // Create test entry
      const { data: testEntry, error: testError } = await supabase
        .from("manual_test_entries" as any)
        .insert({
          user_id: user.id,
          test_name: testData.test_name,
          test_date: testData.test_date,
          total_marks,
        })
        .select()
        .single();

      if (testError) throw testError;

      // Create subject scores
      const subjectScores = testData.subjects.map(subject => ({
        test_entry_id: testEntry.id,
        subject_name: subject.subject_name,
        correct_answers: subject.correct_answers,
        wrong_answers: subject.wrong_answers,
        not_attempted: subject.not_attempted,
        marks_per_question: subject.marks_per_question,
        total_questions: subject.correct_answers + subject.wrong_answers + subject.not_attempted,
        scored_marks: subject.correct_answers * subject.marks_per_question,
      }));

      const { error: scoresError } = await supabase
        .from("subject_scores" as any)
        .insert(subjectScores);

      if (scoresError) throw scoresError;

      return testEntry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manual-tests"] });
      toast({
        title: "Success",
        description: "Test scores added successfully",
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

export const useManualTestAnalytics = () => {
  return useQuery({
    queryKey: ["manual-test-analytics"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("subject_scores" as any)
        .select(`
          *,
          manual_test_entries!inner (
            user_id,
            test_date,
            test_name
          )
        `)
        .eq("manual_test_entries.user_id", user.id)
        .order("manual_test_entries.test_date", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

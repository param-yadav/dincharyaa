
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface EnhancedManualTestEntry {
  id: string;
  user_id: string;
  format_id?: string;
  test_name: string;
  test_date: string;
  total_marks: number;
  time_taken_minutes?: number;
  overall_percentage?: number;
  overall_percentile?: number;
  created_at: string;
  subjects: EnhancedSubjectScore[];
  test_format?: {
    format_name: string;
    description?: string;
  };
}

export interface EnhancedSubjectScore {
  id: string;
  test_entry_id: string;
  subject_name: string;
  correct_answers: number;
  wrong_answers: number;
  not_attempted: number;
  marks_per_question: number;
  total_questions: number;
  scored_marks: number;
  negative_marks: number;
  net_marks: number;
}

export const useEnhancedManualTests = () => {
  return useQuery({
    queryKey: ["enhanced-manual-tests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("manual_test_entries")
        .select(`
          *,
          subject_scores (*),
          test_formats (
            format_name,
            description
          )
        `)
        .order("test_date", { ascending: false });

      if (error) throw error;
      return (data || []) as unknown as EnhancedManualTestEntry[];
    },
  });
};

export const useCreateEnhancedManualTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (testData: {
      format_id?: string;
      test_name: string;
      test_date: string;
      time_taken_minutes?: number;
      overall_percentage?: number;
      overall_percentile?: number;
      subjects: Array<{
        subject_name: string;
        correct_answers: number;
        wrong_answers: number;
        total_questions: number;
        marks_per_question: number;
        negative_marking_ratio: number;
      }>;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Calculate total marks and negative marks for each subject
      let total_marks = 0;
      const processedSubjects = testData.subjects.map(subject => {
        const scored_marks = subject.correct_answers * subject.marks_per_question;
        const negative_marks = subject.wrong_answers * subject.marks_per_question * subject.negative_marking_ratio;
        const net_marks = scored_marks - negative_marks;
        const not_attempted = subject.total_questions - subject.correct_answers - subject.wrong_answers;
        
        total_marks += net_marks;
        
        return {
          subject_name: subject.subject_name,
          correct_answers: subject.correct_answers,
          wrong_answers: subject.wrong_answers,
          not_attempted,
          marks_per_question: subject.marks_per_question,
          total_questions: subject.total_questions,
          scored_marks,
          negative_marks,
          net_marks,
        };
      });

      // Create test entry
      const { data: testEntry, error: testError } = await supabase
        .from("manual_test_entries")
        .insert({
          user_id: user.id,
          format_id: testData.format_id,
          test_name: testData.test_name,
          test_date: testData.test_date,
          total_marks,
          time_taken_minutes: testData.time_taken_minutes,
          overall_percentage: testData.overall_percentage,
          overall_percentile: testData.overall_percentile,
        })
        .select()
        .single();

      if (testError) throw testError;

      // Create subject scores
      const subjectScores = processedSubjects.map(subject => ({
        test_entry_id: testEntry.id,
        ...subject,
      }));

      const { error: scoresError } = await supabase
        .from("subject_scores")
        .insert(subjectScores);

      if (scoresError) throw scoresError;

      return testEntry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enhanced-manual-tests"] });
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

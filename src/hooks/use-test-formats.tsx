
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface TestFormat {
  id: string;
  user_id: string;
  format_name: string;
  description?: string;
  total_time_minutes?: number;
  created_at: string;
  updated_at: string;
  test_format_subjects?: TestFormatSubject[];
}

export interface TestFormatSubject {
  id: string;
  format_id: string;
  subject_name: string;
  total_questions: number;
  marks_per_question: number;
  negative_marking_ratio: number;
  subject_order: number;
  created_at: string;
}

export const useTestFormats = () => {
  return useQuery({
    queryKey: ["test-formats"],
    queryFn: async () => {
      console.log("Fetching test formats...");
      const { data, error } = await supabase
        .from("test_formats")
        .select(`
          *,
          test_format_subjects (*)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching test formats:", error);
        throw error;
      }
      
      console.log("Fetched test formats:", data);
      return (data || []) as unknown as TestFormat[];
    },
  });
};

export const useCreateTestFormat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formatData: {
      format_name: string;
      description?: string;
      total_time_minutes?: number;
      subjects: Array<{
        subject_name: string;
        total_questions: number;
        marks_per_question: number;
        negative_marking_ratio: number;
        subject_order: number;
      }>;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Create test format
      const { data: testFormat, error: formatError } = await supabase
        .from("test_formats")
        .insert({
          user_id: user.id,
          format_name: formatData.format_name,
          description: formatData.description,
          total_time_minutes: formatData.total_time_minutes,
        })
        .select()
        .single();

      if (formatError) throw formatError;

      // Create subjects
      const subjects = formatData.subjects.map(subject => ({
        format_id: testFormat.id,
        subject_name: subject.subject_name,
        total_questions: subject.total_questions,
        marks_per_question: subject.marks_per_question,
        negative_marking_ratio: subject.negative_marking_ratio,
        subject_order: subject.subject_order,
      }));

      const { error: subjectsError } = await supabase
        .from("test_format_subjects")
        .insert(subjects);

      if (subjectsError) throw subjectsError;

      return testFormat;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["test-formats"] });
      toast({
        title: "Success",
        description: "Test format created successfully",
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

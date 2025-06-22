
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface TestTemplate {
  id: string;
  name: string;
  description?: string;
  test_type: "daily" | "custom";
  total_questions: number;
  total_marks: number;
  time_limit_minutes?: number;
  negative_marking_ratio: number;
  created_by: string;
  is_public: boolean;
  created_at: string;
  sections?: TestSection[];
}

export interface TestSection {
  id: string;
  template_id: string;
  name: string;
  question_count: number;
  marks_per_question: number;
  section_order: number;
}

export const useTestTemplates = () => {
  return useQuery({
    queryKey: ["test-templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("test_templates")
        .select(`
          *,
          test_sections (*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as TestTemplate[];
    },
  });
};

export const useCreateTestTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (template: Omit<TestTemplate, "id" | "created_at" | "created_by">) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("test_templates")
        .insert({
          ...template,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["test-templates"] });
      toast({
        title: "Success",
        description: "Test template created successfully",
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

export const useCreateDailyTestTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc("create_daily_test_template");
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["test-templates"] });
      toast({
        title: "Success",
        description: "Daily test template created successfully",
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

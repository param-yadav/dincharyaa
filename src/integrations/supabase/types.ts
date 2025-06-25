export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      manual_test_entries: {
        Row: {
          created_at: string | null
          format_id: string | null
          id: string
          overall_percentage: number | null
          overall_percentile: number | null
          test_date: string
          test_name: string
          time_taken_minutes: number | null
          total_marks: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          format_id?: string | null
          id?: string
          overall_percentage?: number | null
          overall_percentile?: number | null
          test_date: string
          test_name: string
          time_taken_minutes?: number | null
          total_marks?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          format_id?: string | null
          id?: string
          overall_percentage?: number | null
          overall_percentile?: number | null
          test_date?: string
          test_name?: string
          time_taken_minutes?: number | null
          total_marks?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "manual_test_entries_format_id_fkey"
            columns: ["format_id"]
            isOneToOne: false
            referencedRelation: "test_formats"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          content: string
          created_at: string
          id: string
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          related_id: string | null
          title: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          related_id?: string | null
          title: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          related_id?: string | null
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          full_name: string | null
          id: string
          location: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          location?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          location?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      schedules: {
        Row: {
          category: string | null
          color: string | null
          created_at: string | null
          date_from: string
          date_to: string
          description: string | null
          id: string
          is_all_day: boolean | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          color?: string | null
          created_at?: string | null
          date_from: string
          date_to: string
          description?: string | null
          id?: string
          is_all_day?: boolean | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          color?: string | null
          created_at?: string | null
          date_from?: string
          date_to?: string
          description?: string | null
          id?: string
          is_all_day?: boolean | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      subject_scores: {
        Row: {
          correct_answers: number
          created_at: string | null
          id: string
          marks_per_question: number
          negative_marks: number | null
          net_marks: number | null
          not_attempted: number
          scored_marks: number
          subject_name: string
          test_entry_id: string | null
          total_questions: number
          wrong_answers: number
        }
        Insert: {
          correct_answers?: number
          created_at?: string | null
          id?: string
          marks_per_question?: number
          negative_marks?: number | null
          net_marks?: number | null
          not_attempted?: number
          scored_marks?: number
          subject_name: string
          test_entry_id?: string | null
          total_questions?: number
          wrong_answers?: number
        }
        Update: {
          correct_answers?: number
          created_at?: string | null
          id?: string
          marks_per_question?: number
          negative_marks?: number | null
          net_marks?: number | null
          not_attempted?: number
          scored_marks?: number
          subject_name?: string
          test_entry_id?: string | null
          total_questions?: number
          wrong_answers?: number
        }
        Relationships: [
          {
            foreignKeyName: "subject_scores_test_entry_id_fkey"
            columns: ["test_entry_id"]
            isOneToOne: false
            referencedRelation: "manual_test_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      task_assignments: {
        Row: {
          assigned_by: string
          assigned_to: string
          created_at: string
          id: string
          message: string | null
          rejection_reason: string | null
          status: string
          task_id: string
          updated_at: string
        }
        Insert: {
          assigned_by: string
          assigned_to: string
          created_at?: string
          id?: string
          message?: string | null
          rejection_reason?: string | null
          status?: string
          task_id: string
          updated_at?: string
        }
        Update: {
          assigned_by?: string
          assigned_to?: string
          created_at?: string
          id?: string
          message?: string | null
          rejection_reason?: string | null
          status?: string
          task_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_assignments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          assigned_user_id: string | null
          category: string | null
          completed: boolean | null
          created_at: string | null
          description: string | null
          end_time: string | null
          id: string
          is_pinned: boolean | null
          priority: string | null
          reminder_sent: boolean | null
          reminder_time: string | null
          start_time: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          assigned_user_id?: string | null
          category?: string | null
          completed?: boolean | null
          created_at?: string | null
          description?: string | null
          end_time?: string | null
          id?: string
          is_pinned?: boolean | null
          priority?: string | null
          reminder_sent?: boolean | null
          reminder_time?: string | null
          start_time: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          assigned_user_id?: string | null
          category?: string | null
          completed?: boolean | null
          created_at?: string | null
          description?: string | null
          end_time?: string | null
          id?: string
          is_pinned?: boolean | null
          priority?: string | null
          reminder_sent?: boolean | null
          reminder_time?: string | null
          start_time?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      team_invitations: {
        Row: {
          created_at: string
          id: string
          recipient_id: string
          role: string
          sender_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          recipient_id: string
          role: string
          sender_id: string
          status: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          recipient_id?: string
          role?: string
          sender_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      test_answers: {
        Row: {
          attempt_id: string | null
          created_at: string | null
          id: string
          is_correct: boolean | null
          marks_awarded: number | null
          question_id: string | null
          time_taken_seconds: number | null
          user_answer: string | null
        }
        Insert: {
          attempt_id?: string | null
          created_at?: string | null
          id?: string
          is_correct?: boolean | null
          marks_awarded?: number | null
          question_id?: string | null
          time_taken_seconds?: number | null
          user_answer?: string | null
        }
        Update: {
          attempt_id?: string | null
          created_at?: string | null
          id?: string
          is_correct?: boolean | null
          marks_awarded?: number | null
          question_id?: string | null
          time_taken_seconds?: number | null
          user_answer?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "test_answers_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "test_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "test_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      test_attempts: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          started_at: string | null
          test_id: string | null
          time_taken_minutes: number | null
          total_correct: number | null
          total_incorrect: number | null
          total_score: number | null
          total_unanswered: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          started_at?: string | null
          test_id?: string | null
          time_taken_minutes?: number | null
          total_correct?: number | null
          total_incorrect?: number | null
          total_score?: number | null
          total_unanswered?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          started_at?: string | null
          test_id?: string | null
          time_taken_minutes?: number | null
          total_correct?: number | null
          total_incorrect?: number | null
          total_score?: number | null
          total_unanswered?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_attempts_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
      test_format_subjects: {
        Row: {
          created_at: string | null
          format_id: string | null
          id: string
          marks_per_question: number
          negative_marking_ratio: number
          subject_name: string
          subject_order: number
          total_questions: number
        }
        Insert: {
          created_at?: string | null
          format_id?: string | null
          id?: string
          marks_per_question?: number
          negative_marking_ratio?: number
          subject_name: string
          subject_order?: number
          total_questions: number
        }
        Update: {
          created_at?: string | null
          format_id?: string | null
          id?: string
          marks_per_question?: number
          negative_marking_ratio?: number
          subject_name?: string
          subject_order?: number
          total_questions?: number
        }
        Relationships: [
          {
            foreignKeyName: "test_format_subjects_format_id_fkey"
            columns: ["format_id"]
            isOneToOne: false
            referencedRelation: "test_formats"
            referencedColumns: ["id"]
          },
        ]
      }
      test_formats: {
        Row: {
          created_at: string | null
          description: string | null
          format_name: string
          id: string
          total_time_minutes: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          format_name: string
          id?: string
          total_time_minutes?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          format_name?: string
          id?: string
          total_time_minutes?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      test_questions: {
        Row: {
          correct_answer: string
          created_at: string | null
          difficulty_level: number | null
          explanation: string | null
          id: string
          option_a: string | null
          option_b: string | null
          option_c: string | null
          option_d: string | null
          question_order: number
          question_text: string
          question_type: Database["public"]["Enums"]["question_type"] | null
          section_id: string | null
        }
        Insert: {
          correct_answer: string
          created_at?: string | null
          difficulty_level?: number | null
          explanation?: string | null
          id?: string
          option_a?: string | null
          option_b?: string | null
          option_c?: string | null
          option_d?: string | null
          question_order?: number
          question_text: string
          question_type?: Database["public"]["Enums"]["question_type"] | null
          section_id?: string | null
        }
        Update: {
          correct_answer?: string
          created_at?: string | null
          difficulty_level?: number | null
          explanation?: string | null
          id?: string
          option_a?: string | null
          option_b?: string | null
          option_c?: string | null
          option_d?: string | null
          question_order?: number
          question_text?: string
          question_type?: Database["public"]["Enums"]["question_type"] | null
          section_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "test_questions_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "test_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      test_sections: {
        Row: {
          created_at: string | null
          id: string
          marks_per_question: number
          name: string
          question_count: number
          section_order: number
          template_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          marks_per_question?: number
          name: string
          question_count?: number
          section_order?: number
          template_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          marks_per_question?: number
          name?: string
          question_count?: number
          section_order?: number
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "test_sections_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "test_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      test_templates: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          negative_marking_ratio: number | null
          test_type: Database["public"]["Enums"]["test_type"]
          time_limit_minutes: number | null
          total_marks: number
          total_questions: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          negative_marking_ratio?: number | null
          test_type?: Database["public"]["Enums"]["test_type"]
          time_limit_minutes?: number | null
          total_marks?: number
          total_questions?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          negative_marking_ratio?: number | null
          test_type?: Database["public"]["Enums"]["test_type"]
          time_limit_minutes?: number | null
          total_marks?: number
          total_questions?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      tests: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          started_at: string | null
          status: string | null
          template_id: string | null
          test_date: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          started_at?: string | null
          status?: string | null
          template_id?: string | null
          test_date: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          started_at?: string | null
          status?: string | null
          template_id?: string | null
          test_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tests_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "test_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      timer_sessions: {
        Row: {
          created_at: string
          duration: number
          id: string
          notes: string | null
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          duration: number
          id?: string
          notes?: string | null
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          duration?: number
          id?: string
          notes?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_test_score: {
        Args: { p_attempt_id: string }
        Returns: number
      }
      create_assignment_notification: {
        Args: {
          p_user_id: string
          p_title: string
          p_message: string
          p_related_id: string
        }
        Returns: undefined
      }
      create_daily_test_template: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      create_task_assignment: {
        Args: {
          p_task_id: string
          p_assigned_by: string
          p_assigned_to: string
          p_message?: string
        }
        Returns: Json
      }
      create_tasks_from_schedule: {
        Args: { schedule_id: string; schedule_title: string }
        Returns: undefined
      }
      find_user_id_by_email: {
        Args: { email: string }
        Returns: string
      }
      get_user_task_assignments: {
        Args: { user_id: string }
        Returns: Json[]
      }
      get_user_test_analytics: {
        Args: { p_user_id: string; p_period?: string }
        Returns: {
          period_date: string
          avg_score: number
          total_attempts: number
          avg_accuracy: number
        }[]
      }
      respond_to_task_assignment: {
        Args: {
          p_assignment_id: string
          p_accept: boolean
          p_rejection_reason?: string
        }
        Returns: boolean
      }
    }
    Enums: {
      question_type: "multiple_choice" | "true_false"
      test_type: "daily" | "custom"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      question_type: ["multiple_choice", "true_false"],
      test_type: ["daily", "custom"],
    },
  },
} as const

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      daily_routines: {
        Row: {
          completion_percentage: number | null
          created_at: string | null
          date: string
          id: string
          template_id: string
          total_time_minutes: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completion_percentage?: number | null
          created_at?: string | null
          date: string
          id?: string
          template_id: string
          total_time_minutes?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completion_percentage?: number | null
          created_at?: string | null
          date?: string
          id?: string
          template_id?: string
          total_time_minutes?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_daily_routines_template"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "routine_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          category: Database["public"]["Enums"]["productivity_category"]
          created_at: string | null
          current_value: number | null
          description: string | null
          id: string
          priority: Database["public"]["Enums"]["priority_level"] | null
          status: Database["public"]["Enums"]["status_type"] | null
          target_date: string | null
          target_value: number | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category: Database["public"]["Enums"]["productivity_category"]
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["priority_level"] | null
          status?: Database["public"]["Enums"]["status_type"] | null
          target_date?: string | null
          target_value?: number | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["productivity_category"]
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["priority_level"] | null
          status?: Database["public"]["Enums"]["status_type"] | null
          target_date?: string | null
          target_value?: number | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      habit_logs: {
        Row: {
          completed: boolean | null
          count: number | null
          created_at: string | null
          date: string
          habit_id: string
          id: string
          mood: string | null
          notes: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          count?: number | null
          created_at?: string | null
          date: string
          habit_id: string
          id?: string
          mood?: string | null
          notes?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          count?: number | null
          created_at?: string | null
          date?: string
          habit_id?: string
          id?: string
          mood?: string | null
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_habit_logs_habit"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          category: Database["public"]["Enums"]["productivity_category"]
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          reminder_time: string | null
          target_count: number | null
          target_frequency: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category: Database["public"]["Enums"]["productivity_category"]
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          reminder_time?: string | null
          target_count?: number | null
          target_frequency: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["productivity_category"]
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          reminder_time?: string | null
          target_count?: number | null
          target_frequency?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
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
          total_correct: number | null
          total_marks: number
          total_not_attempted: number | null
          total_questions: number | null
          total_wrong: number | null
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
          total_correct?: number | null
          total_marks?: number
          total_not_attempted?: number | null
          total_questions?: number | null
          total_wrong?: number | null
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
          total_correct?: number | null
          total_marks?: number
          total_not_attempted?: number | null
          total_questions?: number | null
          total_wrong?: number | null
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
      pomodoro_sessions: {
        Row: {
          break_duration_minutes: number
          completed: boolean | null
          created_at: string | null
          duration_minutes: number
          id: string
          interrupted_at: string | null
          interruption_reason: string | null
          productivity_rating: number | null
          task_id: string | null
          time_entry_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          break_duration_minutes?: number
          completed?: boolean | null
          created_at?: string | null
          duration_minutes?: number
          id?: string
          interrupted_at?: string | null
          interruption_reason?: string | null
          productivity_rating?: number | null
          task_id?: string | null
          time_entry_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          break_duration_minutes?: number
          completed?: boolean | null
          created_at?: string | null
          duration_minutes?: number
          id?: string
          interrupted_at?: string | null
          interruption_reason?: string | null
          productivity_rating?: number | null
          task_id?: string | null
          time_entry_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_pomodoro_task"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_pomodoro_time_entry"
            columns: ["time_entry_id"]
            isOneToOne: false
            referencedRelation: "time_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      productivity_insights: {
        Row: {
          created_at: string | null
          date: string
          energy_trend: number | null
          focus_score: number | null
          id: string
          insights_data: Json | null
          mood_trend: number | null
          top_category:
            | Database["public"]["Enums"]["productivity_category"]
            | null
          total_break_time: number | null
          total_productive_time: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          energy_trend?: number | null
          focus_score?: number | null
          id?: string
          insights_data?: Json | null
          mood_trend?: number | null
          top_category?:
            | Database["public"]["Enums"]["productivity_category"]
            | null
          total_break_time?: number | null
          total_productive_time?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          energy_trend?: number | null
          focus_score?: number | null
          id?: string
          insights_data?: Json | null
          mood_trend?: number | null
          top_category?:
            | Database["public"]["Enums"]["productivity_category"]
            | null
          total_break_time?: number | null
          total_productive_time?: number | null
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
      routine_executions: {
        Row: {
          actual_duration_minutes: number | null
          actual_end_time: string | null
          actual_start_time: string | null
          created_at: string | null
          daily_routine_id: string
          id: string
          notes: string | null
          routine_item_id: string
          status: Database["public"]["Enums"]["status_type"] | null
          time_entry_id: string | null
          updated_at: string | null
        }
        Insert: {
          actual_duration_minutes?: number | null
          actual_end_time?: string | null
          actual_start_time?: string | null
          created_at?: string | null
          daily_routine_id: string
          id?: string
          notes?: string | null
          routine_item_id: string
          status?: Database["public"]["Enums"]["status_type"] | null
          time_entry_id?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_duration_minutes?: number | null
          actual_end_time?: string | null
          actual_start_time?: string | null
          created_at?: string | null
          daily_routine_id?: string
          id?: string
          notes?: string | null
          routine_item_id?: string
          status?: Database["public"]["Enums"]["status_type"] | null
          time_entry_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_routine_executions_daily"
            columns: ["daily_routine_id"]
            isOneToOne: false
            referencedRelation: "daily_routines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_routine_executions_item"
            columns: ["routine_item_id"]
            isOneToOne: false
            referencedRelation: "routine_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_routine_executions_time"
            columns: ["time_entry_id"]
            isOneToOne: false
            referencedRelation: "time_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      routine_items: {
        Row: {
          category: Database["public"]["Enums"]["productivity_category"]
          created_at: string | null
          description: string | null
          duration_minutes: number
          id: string
          is_mandatory: boolean | null
          order_index: number
          start_time: string
          template_id: string
          title: string
        }
        Insert: {
          category: Database["public"]["Enums"]["productivity_category"]
          created_at?: string | null
          description?: string | null
          duration_minutes: number
          id?: string
          is_mandatory?: boolean | null
          order_index: number
          start_time: string
          template_id: string
          title: string
        }
        Update: {
          category?: Database["public"]["Enums"]["productivity_category"]
          created_at?: string | null
          description?: string | null
          duration_minutes?: number
          id?: string
          is_mandatory?: boolean | null
          order_index?: number
          start_time?: string
          template_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_routine_items_template"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "routine_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      routine_templates: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
          user_id?: string
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
      time_entries: {
        Row: {
          category: Database["public"]["Enums"]["productivity_category"]
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          end_time: string | null
          energy_level: number | null
          goal_id: string | null
          id: string
          location: string | null
          mood: string | null
          productivity_rating: number | null
          start_time: string
          tags: string[] | null
          task_id: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category: Database["public"]["Enums"]["productivity_category"]
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          end_time?: string | null
          energy_level?: number | null
          goal_id?: string | null
          id?: string
          location?: string | null
          mood?: string | null
          productivity_rating?: number | null
          start_time: string
          tags?: string[] | null
          task_id?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["productivity_category"]
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          end_time?: string | null
          energy_level?: number | null
          goal_id?: string | null
          id?: string
          location?: string | null
          mood?: string | null
          productivity_rating?: number | null
          start_time?: string
          tags?: string[] | null
          task_id?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_time_entries_goal"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_time_entries_task"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
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
      priority_level: "low" | "medium" | "high" | "urgent"
      productivity_category:
        | "work"
        | "study"
        | "exercise"
        | "personal"
        | "break"
        | "meeting"
        | "project"
      question_type: "multiple_choice" | "true_false"
      status_type:
        | "pending"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "paused"
      test_type: "daily" | "custom"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      priority_level: ["low", "medium", "high", "urgent"],
      productivity_category: [
        "work",
        "study",
        "exercise",
        "personal",
        "break",
        "meeting",
        "project",
      ],
      question_type: ["multiple_choice", "true_false"],
      status_type: [
        "pending",
        "in_progress",
        "completed",
        "cancelled",
        "paused",
      ],
      test_type: ["daily", "custom"],
    },
  },
} as const

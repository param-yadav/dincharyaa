
-- Create table for test formats (like SSC CGL TIER 1, Railway Group D, etc.)
CREATE TABLE public.test_formats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  format_name TEXT NOT NULL,
  description TEXT,
  total_time_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for subjects within each test format
CREATE TABLE public.test_format_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  format_id UUID REFERENCES public.test_formats(id) ON DELETE CASCADE,
  subject_name TEXT NOT NULL,
  total_questions INTEGER NOT NULL,
  marks_per_question DECIMAL(4,2) NOT NULL DEFAULT 1,
  negative_marking_ratio DECIMAL(4,3) NOT NULL DEFAULT 0,
  subject_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Update manual_test_entries to reference test formats
ALTER TABLE public.manual_test_entries 
ADD COLUMN format_id UUID REFERENCES public.test_formats(id),
ADD COLUMN time_taken_minutes INTEGER,
ADD COLUMN overall_percentage DECIMAL(5,2),
ADD COLUMN overall_percentile DECIMAL(5,2);

-- Update subject_scores to include more detailed tracking
ALTER TABLE public.subject_scores 
ADD COLUMN negative_marks DECIMAL(6,2) DEFAULT 0,
ADD COLUMN net_marks DECIMAL(6,2) DEFAULT 0;

-- Create indexes for better performance
CREATE INDEX idx_test_formats_user ON public.test_formats(user_id);
CREATE INDEX idx_test_format_subjects_format ON public.test_format_subjects(format_id);
CREATE INDEX idx_manual_test_entries_format ON public.manual_test_entries(format_id);

-- Enable RLS on new tables
ALTER TABLE public.test_formats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_format_subjects ENABLE ROW LEVEL SECURITY;

-- RLS Policies for test_formats
CREATE POLICY "Users can view their own test formats" ON public.test_formats
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own test formats" ON public.test_formats
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own test formats" ON public.test_formats
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own test formats" ON public.test_formats
  FOR DELETE USING (user_id = auth.uid());

-- RLS Policies for test_format_subjects
CREATE POLICY "Users can view subjects of their test formats" ON public.test_format_subjects
  FOR SELECT USING (
    format_id IN (
      SELECT id FROM public.test_formats WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create subjects for their test formats" ON public.test_format_subjects
  FOR INSERT WITH CHECK (
    format_id IN (
      SELECT id FROM public.test_formats WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update subjects of their test formats" ON public.test_format_subjects
  FOR UPDATE USING (
    format_id IN (
      SELECT id FROM public.test_formats WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete subjects of their test formats" ON public.test_format_subjects
  FOR DELETE USING (
    format_id IN (
      SELECT id FROM public.test_formats WHERE user_id = auth.uid()
    )
  );

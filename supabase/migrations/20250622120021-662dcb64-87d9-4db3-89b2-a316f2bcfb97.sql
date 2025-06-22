
-- Create table for manual test entries
CREATE TABLE public.manual_test_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  test_name TEXT NOT NULL,
  test_date DATE NOT NULL,
  total_marks INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for subject-wise scores
CREATE TABLE public.subject_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_entry_id UUID REFERENCES public.manual_test_entries(id) ON DELETE CASCADE,
  subject_name TEXT NOT NULL,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  wrong_answers INTEGER NOT NULL DEFAULT 0,
  not_attempted INTEGER NOT NULL DEFAULT 0,
  marks_per_question DECIMAL(4,2) NOT NULL DEFAULT 2,
  total_questions INTEGER NOT NULL DEFAULT 0,
  scored_marks DECIMAL(6,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_manual_test_entries_user ON public.manual_test_entries(user_id);
CREATE INDEX idx_manual_test_entries_date ON public.manual_test_entries(user_id, test_date);
CREATE INDEX idx_subject_scores_test ON public.subject_scores(test_entry_id);

-- Enable RLS on both tables
ALTER TABLE public.manual_test_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subject_scores ENABLE ROW LEVEL SECURITY;

-- RLS Policies for manual_test_entries
CREATE POLICY "Users can view their own test entries" ON public.manual_test_entries
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own test entries" ON public.manual_test_entries
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own test entries" ON public.manual_test_entries
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own test entries" ON public.manual_test_entries
  FOR DELETE USING (user_id = auth.uid());

-- RLS Policies for subject_scores
CREATE POLICY "Users can view scores of their test entries" ON public.subject_scores
  FOR SELECT USING (
    test_entry_id IN (
      SELECT id FROM public.manual_test_entries WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create scores for their test entries" ON public.subject_scores
  FOR INSERT WITH CHECK (
    test_entry_id IN (
      SELECT id FROM public.manual_test_entries WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update scores of their test entries" ON public.subject_scores
  FOR UPDATE USING (
    test_entry_id IN (
      SELECT id FROM public.manual_test_entries WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete scores of their test entries" ON public.subject_scores
  FOR DELETE USING (
    test_entry_id IN (
      SELECT id FROM public.manual_test_entries WHERE user_id = auth.uid()
    )
  );

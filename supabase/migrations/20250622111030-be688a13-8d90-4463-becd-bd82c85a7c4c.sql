
-- Create enum types for test configuration
CREATE TYPE public.test_type AS ENUM ('daily', 'custom');
CREATE TYPE public.question_type AS ENUM ('multiple_choice', 'true_false');

-- Test templates table (stores test configurations)
CREATE TABLE public.test_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  test_type public.test_type NOT NULL DEFAULT 'custom',
  total_questions INTEGER NOT NULL DEFAULT 0,
  total_marks INTEGER NOT NULL DEFAULT 0,
  time_limit_minutes INTEGER,
  negative_marking_ratio DECIMAL(3,2) DEFAULT 0.25, -- 0.25 means -0.5 for 2 marks
  created_by UUID NOT NULL,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Test sections table (subjects/topics within tests)
CREATE TABLE public.test_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES public.test_templates(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- Reasoning, Mathematics, English, General Knowledge, etc.
  question_count INTEGER NOT NULL DEFAULT 25,
  marks_per_question INTEGER NOT NULL DEFAULT 2,
  section_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Test instances table (actual tests taken on specific dates)
CREATE TABLE public.tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES public.test_templates(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  test_date DATE NOT NULL,
  status TEXT DEFAULT 'not_started', -- not_started, in_progress, completed
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Test questions table
CREATE TABLE public.test_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID REFERENCES public.test_sections(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type public.question_type DEFAULT 'multiple_choice',
  option_a TEXT,
  option_b TEXT,
  option_c TEXT,
  option_d TEXT,
  correct_answer TEXT NOT NULL, -- A, B, C, D, or TRUE, FALSE
  explanation TEXT,
  difficulty_level INTEGER DEFAULT 1, -- 1-5 scale
  question_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Test attempts table (user's attempt at a specific test)
CREATE TABLE public.test_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID REFERENCES public.tests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  total_score DECIMAL(6,2) DEFAULT 0,
  total_correct INTEGER DEFAULT 0,
  total_incorrect INTEGER DEFAULT 0,
  total_unanswered INTEGER DEFAULT 0,
  time_taken_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Test answers table (individual answers given by users)
CREATE TABLE public.test_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID REFERENCES public.test_attempts(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.test_questions(id) ON DELETE CASCADE,
  user_answer TEXT, -- A, B, C, D, TRUE, FALSE, or NULL for unanswered
  is_correct BOOLEAN DEFAULT false,
  marks_awarded DECIMAL(4,2) DEFAULT 0,
  time_taken_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_test_templates_created_by ON public.test_templates(created_by);
CREATE INDEX idx_test_templates_type ON public.test_templates(test_type);
CREATE INDEX idx_tests_user_date ON public.tests(user_id, test_date);
CREATE INDEX idx_test_attempts_user ON public.test_attempts(user_id);
CREATE INDEX idx_test_attempts_completed ON public.test_attempts(user_id, completed_at) WHERE completed_at IS NOT NULL;
CREATE INDEX idx_test_answers_attempt ON public.test_answers(attempt_id);

-- Enable RLS on all tables
ALTER TABLE public.test_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_answers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for test_templates
CREATE POLICY "Users can view public templates and own templates" ON public.test_templates
  FOR SELECT USING (is_public = true OR created_by = auth.uid());

CREATE POLICY "Users can create their own templates" ON public.test_templates
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own templates" ON public.test_templates
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own templates" ON public.test_templates
  FOR DELETE USING (created_by = auth.uid());

-- RLS Policies for test_sections (inherit from template permissions)
CREATE POLICY "Users can view sections of accessible templates" ON public.test_sections
  FOR SELECT USING (
    template_id IN (
      SELECT id FROM public.test_templates 
      WHERE is_public = true OR created_by = auth.uid()
    )
  );

CREATE POLICY "Users can manage sections of their templates" ON public.test_sections
  FOR ALL USING (
    template_id IN (
      SELECT id FROM public.test_templates WHERE created_by = auth.uid()
    )
  );

-- RLS Policies for tests
CREATE POLICY "Users can view their own tests" ON public.tests
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own tests" ON public.tests
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own tests" ON public.tests
  FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for test_questions (inherit from template permissions)
CREATE POLICY "Users can view questions of accessible templates" ON public.test_questions
  FOR SELECT USING (
    section_id IN (
      SELECT ts.id FROM public.test_sections ts
      JOIN public.test_templates tt ON ts.template_id = tt.id
      WHERE tt.is_public = true OR tt.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can manage questions of their templates" ON public.test_questions
  FOR ALL USING (
    section_id IN (
      SELECT ts.id FROM public.test_sections ts
      JOIN public.test_templates tt ON ts.template_id = tt.id
      WHERE tt.created_by = auth.uid()
    )
  );

-- RLS Policies for test_attempts
CREATE POLICY "Users can view their own attempts" ON public.test_attempts
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own attempts" ON public.test_attempts
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own attempts" ON public.test_attempts
  FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for test_answers
CREATE POLICY "Users can view their own answers" ON public.test_answers
  FOR SELECT USING (
    attempt_id IN (
      SELECT id FROM public.test_attempts WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own answers" ON public.test_answers
  FOR INSERT WITH CHECK (
    attempt_id IN (
      SELECT id FROM public.test_attempts WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own answers" ON public.test_answers
  FOR UPDATE USING (
    attempt_id IN (
      SELECT id FROM public.test_attempts WHERE user_id = auth.uid()
    )
  );

-- Function to calculate test score
CREATE OR REPLACE FUNCTION public.calculate_test_score(p_attempt_id UUID)
RETURNS DECIMAL(6,2)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_score DECIMAL(6,2) := 0;
  correct_count INTEGER := 0;
  incorrect_count INTEGER := 0;
  unanswered_count INTEGER := 0;
  section_record RECORD;
BEGIN
  -- Calculate scores per section
  FOR section_record IN
    SELECT 
      ts.marks_per_question,
      tt.negative_marking_ratio,
      COUNT(CASE WHEN ta.is_correct = true THEN 1 END) as correct_answers,
      COUNT(CASE WHEN ta.is_correct = false AND ta.user_answer IS NOT NULL THEN 1 END) as wrong_answers,
      COUNT(CASE WHEN ta.user_answer IS NULL THEN 1 END) as unanswered_answers
    FROM public.test_answers ta
    JOIN public.test_questions tq ON ta.question_id = tq.id
    JOIN public.test_sections ts ON tq.section_id = ts.id
    JOIN public.test_templates tt ON ts.template_id = tt.id
    WHERE ta.attempt_id = p_attempt_id
    GROUP BY ts.id, ts.marks_per_question, tt.negative_marking_ratio
  LOOP
    -- Add positive marks for correct answers
    total_score := total_score + (section_record.correct_answers * section_record.marks_per_question);
    
    -- Subtract negative marks for wrong answers
    total_score := total_score - (section_record.wrong_answers * section_record.marks_per_question * section_record.negative_marking_ratio);
    
    -- Update totals
    correct_count := correct_count + section_record.correct_answers;
    incorrect_count := incorrect_count + section_record.wrong_answers;
    unanswered_count := unanswered_count + section_record.unanswered_answers;
  END LOOP;
  
  -- Update the attempt record
  UPDATE public.test_attempts 
  SET 
    total_score = total_score,
    total_correct = correct_count,
    total_incorrect = incorrect_count,
    total_unanswered = unanswered_count,
    completed_at = CASE WHEN completed_at IS NULL THEN now() ELSE completed_at END
  WHERE id = p_attempt_id;
  
  RETURN total_score;
END;
$$;

-- Function to create default daily test template
CREATE OR REPLACE FUNCTION public.create_daily_test_template()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  template_id UUID;
  section_names TEXT[] := ARRAY['Reasoning', 'Mathematics', 'English', 'General Knowledge'];
  section_name TEXT;
BEGIN
  -- Create the main template
  INSERT INTO public.test_templates (
    name,
    description,
    test_type,
    total_questions,
    total_marks,
    time_limit_minutes,
    negative_marking_ratio,
    created_by,
    is_public
  ) VALUES (
    'Daily Test',
    'Standard daily test with 4 sections: Reasoning, Mathematics, English, and General Knowledge',
    'daily',
    100,
    200,
    120, -- 2 hours
    0.25, -- -0.5 marks for 2 marks question
    auth.uid(),
    false
  ) RETURNING id INTO template_id;
  
  -- Create sections
  FOREACH section_name IN ARRAY section_names
  LOOP
    INSERT INTO public.test_sections (
      template_id,
      name,
      question_count,
      marks_per_question,
      section_order
    ) VALUES (
      template_id,
      section_name,
      25,
      2,
      array_position(section_names, section_name)
    );
  END LOOP;
  
  RETURN template_id;
END;
$$;

-- Function to get user test analytics
CREATE OR REPLACE FUNCTION public.get_user_test_analytics(
  p_user_id UUID,
  p_period TEXT DEFAULT 'month' -- 'week', 'month', 'year'
)
RETURNS TABLE (
  period_date DATE,
  avg_score DECIMAL(6,2),
  total_attempts INTEGER,
  avg_accuracy DECIMAL(5,2)
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  date_trunc_period TEXT;
BEGIN
  -- Set the date truncation period
  CASE p_period
    WHEN 'week' THEN date_trunc_period := 'week';
    WHEN 'year' THEN date_trunc_period := 'year';
    ELSE date_trunc_period := 'month';
  END CASE;
  
  RETURN QUERY
  SELECT 
    DATE_TRUNC(date_trunc_period, ta.completed_at)::DATE as period_date,
    AVG(ta.total_score) as avg_score,
    COUNT(*)::INTEGER as total_attempts,
    AVG(CASE 
      WHEN (ta.total_correct + ta.total_incorrect) > 0 
      THEN (ta.total_correct::DECIMAL / (ta.total_correct + ta.total_incorrect)) * 100
      ELSE 0 
    END) as avg_accuracy
  FROM public.test_attempts ta
  WHERE ta.user_id = p_user_id 
    AND ta.completed_at IS NOT NULL
    AND ta.completed_at >= (
      CASE p_period
        WHEN 'week' THEN now() - INTERVAL '12 weeks'
        WHEN 'year' THEN now() - INTERVAL '5 years'
        ELSE now() - INTERVAL '12 months'
      END
    )
  GROUP BY DATE_TRUNC(date_trunc_period, ta.completed_at)
  ORDER BY period_date DESC;
END;
$$;

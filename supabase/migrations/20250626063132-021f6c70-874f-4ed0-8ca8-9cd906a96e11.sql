
-- Add columns to manual_test_entries to store aggregated data (only if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='manual_test_entries' AND column_name='total_questions') THEN
        ALTER TABLE manual_test_entries ADD COLUMN total_questions INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='manual_test_entries' AND column_name='total_correct') THEN
        ALTER TABLE manual_test_entries ADD COLUMN total_correct INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='manual_test_entries' AND column_name='total_wrong') THEN
        ALTER TABLE manual_test_entries ADD COLUMN total_wrong INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='manual_test_entries' AND column_name='total_not_attempted') THEN
        ALTER TABLE manual_test_entries ADD COLUMN total_not_attempted INTEGER DEFAULT 0;
    END IF;
END $$;

-- Ensure RLS is enabled on all tables
ALTER TABLE manual_test_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE subject_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_formats ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_format_subjects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view their own test entries" ON manual_test_entries;
DROP POLICY IF EXISTS "Users can create their own test entries" ON manual_test_entries;
DROP POLICY IF EXISTS "Users can update their own test entries" ON manual_test_entries;
DROP POLICY IF EXISTS "Users can delete their own test entries" ON manual_test_entries;

CREATE POLICY "Users can view their own test entries" 
ON manual_test_entries FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own test entries" 
ON manual_test_entries FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own test entries" 
ON manual_test_entries FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own test entries" 
ON manual_test_entries FOR DELETE 
USING (auth.uid() = user_id);

-- Subject scores policies
DROP POLICY IF EXISTS "Users can view subject scores for their test entries" ON subject_scores;
DROP POLICY IF EXISTS "Users can create subject scores for their test entries" ON subject_scores;
DROP POLICY IF EXISTS "Users can update subject scores for their test entries" ON subject_scores;
DROP POLICY IF EXISTS "Users can delete subject scores for their test entries" ON subject_scores;

CREATE POLICY "Users can view subject scores for their test entries" 
ON subject_scores FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM manual_test_entries mte 
  WHERE mte.id = subject_scores.test_entry_id 
  AND mte.user_id = auth.uid()
));

CREATE POLICY "Users can create subject scores for their test entries" 
ON subject_scores FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM manual_test_entries mte 
  WHERE mte.id = subject_scores.test_entry_id 
  AND mte.user_id = auth.uid()
));

CREATE POLICY "Users can update subject scores for their test entries" 
ON subject_scores FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM manual_test_entries mte 
  WHERE mte.id = subject_scores.test_entry_id 
  AND mte.user_id = auth.uid()
));

CREATE POLICY "Users can delete subject scores for their test entries" 
ON subject_scores FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM manual_test_entries mte 
  WHERE mte.id = subject_scores.test_entry_id 
  AND mte.user_id = auth.uid()
));

-- Test formats policies
DROP POLICY IF EXISTS "Users can view their own test formats" ON test_formats;
DROP POLICY IF EXISTS "Users can create their own test formats" ON test_formats;
DROP POLICY IF EXISTS "Users can update their own test formats" ON test_formats;
DROP POLICY IF EXISTS "Users can delete their own test formats" ON test_formats;

CREATE POLICY "Users can view their own test formats" 
ON test_formats FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own test formats" 
ON test_formats FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own test formats" 
ON test_formats FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own test formats" 
ON test_formats FOR DELETE 
USING (auth.uid() = user_id);

-- Test format subjects policies
DROP POLICY IF EXISTS "Users can view subjects for their test formats" ON test_format_subjects;
DROP POLICY IF EXISTS "Users can create subjects for their test formats" ON test_format_subjects;
DROP POLICY IF EXISTS "Users can update subjects for their test formats" ON test_format_subjects;
DROP POLICY IF EXISTS "Users can delete subjects for their test formats" ON test_format_subjects;

CREATE POLICY "Users can view subjects for their test formats" 
ON test_format_subjects FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM test_formats tf 
  WHERE tf.id = test_format_subjects.format_id 
  AND tf.user_id = auth.uid()
));

CREATE POLICY "Users can create subjects for their test formats" 
ON test_format_subjects FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM test_formats tf 
  WHERE tf.id = test_format_subjects.format_id 
  AND tf.user_id = auth.uid()
));

CREATE POLICY "Users can update subjects for their test formats" 
ON test_format_subjects FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM test_formats tf 
  WHERE tf.id = test_format_subjects.format_id 
  AND tf.user_id = auth.uid()
));

CREATE POLICY "Users can delete subjects for their test formats" 
ON test_format_subjects FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM test_formats tf 
  WHERE tf.id = test_format_subjects.format_id 
  AND tf.user_id = auth.uid()
));

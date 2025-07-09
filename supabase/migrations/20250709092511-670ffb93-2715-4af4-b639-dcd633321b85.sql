-- Comprehensive Productivity Time Management Database Schema

-- Create productivity categories enum
CREATE TYPE productivity_category AS ENUM ('work', 'study', 'exercise', 'personal', 'break', 'meeting', 'project');

-- Create priority levels enum  
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'urgent');

-- Create status enum
CREATE TYPE status_type AS ENUM ('pending', 'in_progress', 'completed', 'cancelled', 'paused');

-- Enhanced Goals table for long-term tracking
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category productivity_category NOT NULL,
    priority priority_level DEFAULT 'medium',
    target_value INTEGER, -- for quantifiable goals
    current_value INTEGER DEFAULT 0,
    target_date DATE,
    status status_type DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enhanced time tracking with detailed analytics
CREATE TABLE time_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    task_id UUID, -- optional link to tasks
    goal_id UUID, -- optional link to goals
    category productivity_category NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    duration_minutes INTEGER,
    productivity_rating INTEGER CHECK (productivity_rating >= 1 AND productivity_rating <= 5),
    tags TEXT[],
    location TEXT,
    mood TEXT,
    energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 5),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Daily routine templates
CREATE TABLE routine_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Routine template items
CREATE TABLE routine_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category productivity_category NOT NULL,
    start_time TIME NOT NULL,
    duration_minutes INTEGER NOT NULL,
    is_mandatory BOOLEAN DEFAULT true,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Daily routine executions
CREATE TABLE daily_routines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    template_id UUID NOT NULL,
    date DATE NOT NULL,
    completion_percentage DECIMAL(5,2) DEFAULT 0,
    total_time_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, template_id, date)
);

-- Routine execution tracking
CREATE TABLE routine_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    daily_routine_id UUID NOT NULL,
    routine_item_id UUID NOT NULL,
    time_entry_id UUID, -- link to actual time tracking
    status status_type DEFAULT 'pending',
    actual_start_time TIMESTAMPTZ,
    actual_end_time TIMESTAMPTZ,
    actual_duration_minutes INTEGER,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Habits tracking
CREATE TABLE habits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    category productivity_category NOT NULL,
    target_frequency TEXT NOT NULL, -- 'daily', 'weekly', 'monthly'
    target_count INTEGER DEFAULT 1,
    reminder_time TIME,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Daily habit tracking
CREATE TABLE habit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    habit_id UUID NOT NULL,
    user_id UUID NOT NULL,
    date DATE NOT NULL,
    count INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT false,
    notes TEXT,
    mood TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(habit_id, user_id, date)
);

-- Productivity analytics and insights
CREATE TABLE productivity_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    date DATE NOT NULL,
    total_productive_time INTEGER DEFAULT 0,
    total_break_time INTEGER DEFAULT 0,
    focus_score DECIMAL(3,2), -- calculated focus metric
    energy_trend DECIMAL(3,2),
    mood_trend DECIMAL(3,2),
    top_category productivity_category,
    insights_data JSONB, -- store detailed analytics
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, date)
);

-- Pomodoro sessions enhanced
CREATE TABLE pomodoro_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    task_id UUID,
    time_entry_id UUID,
    duration_minutes INTEGER NOT NULL DEFAULT 25,
    break_duration_minutes INTEGER NOT NULL DEFAULT 5,
    completed BOOLEAN DEFAULT false,
    interrupted_at TIMESTAMPTZ,
    interruption_reason TEXT,
    productivity_rating INTEGER CHECK (productivity_rating >= 1 AND productivity_rating <= 5),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE routine_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE routine_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE routine_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE productivity_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE pomodoro_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their own goals" ON goals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own time entries" ON time_entries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own routine templates" ON routine_templates FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage routine items for their templates" ON routine_items FOR ALL USING (
    template_id IN (SELECT id FROM routine_templates WHERE user_id = auth.uid())
);
CREATE POLICY "Users can manage their own daily routines" ON daily_routines FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage routine executions for their routines" ON routine_executions FOR ALL USING (
    daily_routine_id IN (SELECT id FROM daily_routines WHERE user_id = auth.uid())
);
CREATE POLICY "Users can manage their own habits" ON habits FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own habit logs" ON habit_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own productivity insights" ON productivity_insights FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own pomodoro sessions" ON pomodoro_sessions FOR ALL USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_time_entries_user_date ON time_entries(user_id, DATE(start_time));
CREATE INDEX idx_daily_routines_user_date ON daily_routines(user_id, date);
CREATE INDEX idx_habit_logs_user_date ON habit_logs(user_id, date);
CREATE INDEX idx_productivity_insights_user_date ON productivity_insights(user_id, date);
CREATE INDEX idx_goals_user_status ON goals(user_id, status);
CREATE INDEX idx_habits_user_active ON habits(user_id, is_active);

-- Add foreign key constraints
ALTER TABLE routine_items ADD CONSTRAINT fk_routine_items_template FOREIGN KEY (template_id) REFERENCES routine_templates(id) ON DELETE CASCADE;
ALTER TABLE daily_routines ADD CONSTRAINT fk_daily_routines_template FOREIGN KEY (template_id) REFERENCES routine_templates(id) ON DELETE CASCADE;
ALTER TABLE routine_executions ADD CONSTRAINT fk_routine_executions_daily FOREIGN KEY (daily_routine_id) REFERENCES daily_routines(id) ON DELETE CASCADE;
ALTER TABLE routine_executions ADD CONSTRAINT fk_routine_executions_item FOREIGN KEY (routine_item_id) REFERENCES routine_items(id) ON DELETE CASCADE;
ALTER TABLE routine_executions ADD CONSTRAINT fk_routine_executions_time FOREIGN KEY (time_entry_id) REFERENCES time_entries(id) ON DELETE SET NULL;
ALTER TABLE habit_logs ADD CONSTRAINT fk_habit_logs_habit FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE;
ALTER TABLE time_entries ADD CONSTRAINT fk_time_entries_task FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL;
ALTER TABLE time_entries ADD CONSTRAINT fk_time_entries_goal FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE SET NULL;
ALTER TABLE pomodoro_sessions ADD CONSTRAINT fk_pomodoro_task FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL;
ALTER TABLE pomodoro_sessions ADD CONSTRAINT fk_pomodoro_time_entry FOREIGN KEY (time_entry_id) REFERENCES time_entries(id) ON DELETE SET NULL;

-- Create functions for automatic calculations
CREATE OR REPLACE FUNCTION calculate_daily_productivity_insights(p_user_id UUID, p_date DATE)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    total_productive_time INTEGER := 0;
    total_break_time INTEGER := 0;
    avg_productivity_rating DECIMAL := 0;
    avg_energy_level DECIMAL := 0;
    top_cat productivity_category;
BEGIN
    -- Calculate total productive time and break time
    SELECT 
        COALESCE(SUM(CASE WHEN category != 'break' THEN duration_minutes ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN category = 'break' THEN duration_minutes ELSE 0 END), 0),
        COALESCE(AVG(productivity_rating), 0),
        COALESCE(AVG(energy_level), 0)
    INTO total_productive_time, total_break_time, avg_productivity_rating, avg_energy_level
    FROM time_entries 
    WHERE user_id = p_user_id AND DATE(start_time) = p_date;
    
    -- Find top category
    SELECT category INTO top_cat
    FROM time_entries 
    WHERE user_id = p_user_id AND DATE(start_time) = p_date AND category != 'break'
    GROUP BY category 
    ORDER BY SUM(duration_minutes) DESC 
    LIMIT 1;
    
    -- Insert or update insights
    INSERT INTO productivity_insights (
        user_id, date, total_productive_time, total_break_time, 
        focus_score, energy_trend, top_category,
        insights_data
    ) VALUES (
        p_user_id, p_date, total_productive_time, total_break_time,
        avg_productivity_rating, avg_energy_level, top_cat,
        jsonb_build_object(
            'avg_productivity_rating', avg_productivity_rating,
            'avg_energy_level', avg_energy_level,
            'total_sessions', (SELECT COUNT(*) FROM time_entries WHERE user_id = p_user_id AND DATE(start_time) = p_date)
        )
    )
    ON CONFLICT (user_id, date) 
    DO UPDATE SET 
        total_productive_time = EXCLUDED.total_productive_time,
        total_break_time = EXCLUDED.total_break_time,
        focus_score = EXCLUDED.focus_score,
        energy_trend = EXCLUDED.energy_trend,
        top_category = EXCLUDED.top_category,
        insights_data = EXCLUDED.insights_data;
END;
$$;

-- Create trigger to update insights when time entries change
CREATE OR REPLACE FUNCTION trigger_update_productivity_insights()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        PERFORM calculate_daily_productivity_insights(OLD.user_id, DATE(OLD.start_time));
        RETURN OLD;
    ELSE
        PERFORM calculate_daily_productivity_insights(NEW.user_id, DATE(NEW.start_time));
        RETURN NEW;
    END IF;
END;
$$;

CREATE TRIGGER update_productivity_insights_trigger
    AFTER INSERT OR UPDATE OR DELETE ON time_entries
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_productivity_insights();

-- Create function to auto-complete time entries
CREATE OR REPLACE FUNCTION auto_complete_time_entry(p_entry_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE time_entries 
    SET 
        end_time = now(),
        duration_minutes = EXTRACT(EPOCH FROM (now() - start_time))/60
    WHERE id = p_entry_id AND end_time IS NULL;
END;
$$;
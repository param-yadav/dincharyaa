-- Create functions for automatic calculations and insights
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
    WHERE user_id = p_user_id AND start_time::date = p_date;
    
    -- Find top category
    SELECT category INTO top_cat
    FROM time_entries 
    WHERE user_id = p_user_id AND start_time::date = p_date AND category != 'break'
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
            'total_sessions', (SELECT COUNT(*) FROM time_entries WHERE user_id = p_user_id AND start_time::date = p_date)
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
        PERFORM calculate_daily_productivity_insights(OLD.user_id, OLD.start_time::date);
        RETURN OLD;
    ELSE
        PERFORM calculate_daily_productivity_insights(NEW.user_id, NEW.start_time::date);
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

-- Function to get productivity analytics for a user
CREATE OR REPLACE FUNCTION get_productivity_analytics(p_user_id UUID, p_start_date DATE, p_end_date DATE)
RETURNS TABLE(
    date DATE,
    total_productive_time INTEGER,
    total_break_time INTEGER,
    focus_score DECIMAL,
    energy_trend DECIMAL,
    top_category productivity_category
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pi.date,
        pi.total_productive_time,
        pi.total_break_time,
        pi.focus_score,
        pi.energy_trend,
        pi.top_category
    FROM productivity_insights pi
    WHERE pi.user_id = p_user_id 
    AND pi.date BETWEEN p_start_date AND p_end_date
    ORDER BY pi.date DESC;
END;
$$;

-- Function to start a time entry
CREATE OR REPLACE FUNCTION start_time_entry(
    p_user_id UUID,
    p_title TEXT,
    p_category productivity_category,
    p_description TEXT DEFAULT NULL,
    p_task_id UUID DEFAULT NULL,
    p_goal_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    entry_id UUID;
BEGIN
    INSERT INTO time_entries (
        user_id, title, category, description, task_id, goal_id, start_time
    ) VALUES (
        p_user_id, p_title, p_category, p_description, p_task_id, p_goal_id, now()
    ) RETURNING id INTO entry_id;
    
    RETURN entry_id;
END;
$$;
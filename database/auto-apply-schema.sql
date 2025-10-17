-- Auto-Apply Database Schema
-- This file contains the complete database schema for the auto-apply feature

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Auto-Apply Configurations Table
CREATE TABLE IF NOT EXISTS auto_apply_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    form_id UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
    
    -- Personal Information
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    country TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    current_job_title TEXT,
    current_company TEXT,
    current_salary TEXT,
    desired_salary TEXT NOT NULL,
    notice_period TEXT,
    work_auth TEXT NOT NULL,
    field_of_study TEXT,
    graduation_year TEXT,
    linkedin_url TEXT NOT NULL,
    website TEXT,
    github_url TEXT,
    
    -- Resume Information
    selected_resume_id UUID REFERENCES resumes(id) ON DELETE SET NULL,
    uploaded_resume_path TEXT,
    
    -- Application Questions
    legally_authorized TEXT NOT NULL,
    require_sponsorship TEXT NOT NULL,
    current_location TEXT,
    years_experience TEXT,
    expected_salary TEXT,
    start_date TEXT,
    interest_reason TEXT,
    key_skills TEXT,
    disabilities TEXT,
    gender TEXT,
    race TEXT,
    veteran TEXT,
    
    -- Search Preferences
    search_terms TEXT NOT NULL,
    randomize_search BOOLEAN DEFAULT FALSE,
    search_location TEXT NOT NULL,
    experience_level TEXT,
    salary_range TEXT,
    target_experience TEXT,
    preferred_job_types TEXT[] DEFAULT '{}',
    industries TEXT,
    blacklisted_companies TEXT,
    whitelisted_companies TEXT,
    skip_keywords TEXT,
    prioritize_keywords TEXT,
    skip_security_clearance BOOLEAN DEFAULT FALSE,
    follow_companies BOOLEAN DEFAULT FALSE,
    
    -- Additional Settings
    resume_ready BOOLEAN DEFAULT FALSE,
    use_web_ui BOOLEAN DEFAULT TRUE,
    
    -- Skills and Experience (JSON fields)
    skills JSONB DEFAULT '[]',
    work_experience JSONB DEFAULT '[]',
    education JSONB DEFAULT '[]',
    projects TEXT,
    certifications TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Applied Jobs Table
CREATE TABLE IF NOT EXISTS applied_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    config_id UUID REFERENCES auto_apply_configs(id) ON DELETE CASCADE,
    
    -- Job Information
    job_title TEXT NOT NULL,
    company_name TEXT NOT NULL,
    job_url TEXT NOT NULL,
    job_description TEXT,
    location TEXT,
    salary_range TEXT,
    employment_type TEXT,
    
    -- Application Status
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'applied', 'error', 'skipped')),
    error_message TEXT,
    application_data JSONB,
    
    -- Timestamps
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Job Search History Table
CREATE TABLE IF NOT EXISTS job_search_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    config_id UUID REFERENCES auto_apply_configs(id) ON DELETE CASCADE,
    
    -- Search Parameters
    search_terms TEXT NOT NULL,
    search_location TEXT NOT NULL,
    filters JSONB DEFAULT '{}',
    
    -- Results
    jobs_found INTEGER DEFAULT 0,
    jobs_applied INTEGER DEFAULT 0,
    jobs_skipped INTEGER DEFAULT 0,
    jobs_failed INTEGER DEFAULT 0,
    
    -- Timestamps
    searched_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Auto-Apply Activity Log
CREATE TABLE IF NOT EXISTS auto_apply_activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    config_id UUID REFERENCES auto_apply_configs(id) ON DELETE CASCADE,
    
    -- Activity Information
    activity_type TEXT NOT NULL CHECK (activity_type IN ('config_created', 'config_updated', 'config_deleted', 'auto_apply_started', 'auto_apply_stopped', 'job_applied', 'job_skipped', 'job_failed', 'search_completed')),
    description TEXT,
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_auto_apply_configs_user_id ON auto_apply_configs(user_id);
CREATE INDEX IF NOT EXISTS idx_auto_apply_configs_form_id ON auto_apply_configs(form_id);
CREATE INDEX IF NOT EXISTS idx_applied_jobs_user_id ON applied_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_applied_jobs_status ON applied_jobs(status);
CREATE INDEX IF NOT EXISTS idx_applied_jobs_applied_at ON applied_jobs(applied_at);
CREATE INDEX IF NOT EXISTS idx_job_search_history_user_id ON job_search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON auto_apply_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_activity_type ON auto_apply_activity_log(activity_type);

-- Row Level Security (RLS) Policies
ALTER TABLE auto_apply_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applied_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE auto_apply_activity_log ENABLE ROW LEVEL SECURITY;

-- Auto-Apply Configs Policies
CREATE POLICY "Users can view own auto apply configs" ON auto_apply_configs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own auto apply configs" ON auto_apply_configs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own auto apply configs" ON auto_apply_configs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own auto apply configs" ON auto_apply_configs
    FOR DELETE USING (auth.uid() = user_id);

-- Applied Jobs Policies
CREATE POLICY "Users can view own applied jobs" ON applied_jobs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applied jobs" ON applied_jobs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applied jobs" ON applied_jobs
    FOR UPDATE USING (auth.uid() = user_id);

-- Job Search History Policies
CREATE POLICY "Users can view own job search history" ON job_search_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own job search history" ON job_search_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Activity Log Policies
CREATE POLICY "Users can view own activity log" ON auto_apply_activity_log
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity log" ON auto_apply_activity_log
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_auto_apply_configs_updated_at
    BEFORE UPDATE ON auto_apply_configs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applied_jobs_updated_at
    BEFORE UPDATE ON applied_jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to log activity
CREATE OR REPLACE FUNCTION log_auto_apply_activity(
    p_user_id UUID,
    p_config_id UUID,
    p_activity_type TEXT,
    p_description TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    activity_id UUID;
BEGIN
    INSERT INTO auto_apply_activity_log (
        user_id,
        config_id,
        activity_type,
        description,
        metadata
    ) VALUES (
        p_user_id,
        p_config_id,
        p_activity_type,
        p_description,
        p_metadata
    ) RETURNING id INTO activity_id;
    
    RETURN activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's auto-apply status
CREATE OR REPLACE FUNCTION get_user_auto_apply_status(p_user_id UUID)
RETURNS TABLE (
    is_active BOOLEAN,
    credits INTEGER,
    last_auto_applied TIMESTAMP WITH TIME ZONE,
    total_configs INTEGER,
    total_applications INTEGER,
    successful_applications INTEGER,
    failed_applications INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(u."Auto-Apply", false) as is_active,
        COALESCE(u.credits, 0) as credits,
        u.last_auto_applied,
        COUNT(DISTINCT aac.id)::INTEGER as total_configs,
        COUNT(DISTINCT aj.id)::INTEGER as total_applications,
        COUNT(DISTINCT CASE WHEN aj.status = 'applied' THEN aj.id END)::INTEGER as successful_applications,
        COUNT(DISTINCT CASE WHEN aj.status = 'error' THEN aj.id END)::INTEGER as failed_applications
    FROM users u
    LEFT JOIN auto_apply_configs aac ON aac.user_id = u.id
    LEFT JOIN applied_jobs aj ON aj.user_id = u.id
    WHERE u.id = p_user_id
    GROUP BY u.id, u."Auto-Apply", u.credits, u.last_auto_applied;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up old activity logs (keep last 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_activity_logs()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM auto_apply_activity_log 
    WHERE created_at < NOW() - INTERVAL '30 days';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON auto_apply_configs TO authenticated;
GRANT ALL ON applied_jobs TO authenticated;
GRANT ALL ON job_search_history TO authenticated;
GRANT ALL ON auto_apply_activity_log TO authenticated;
GRANT EXECUTE ON FUNCTION log_auto_apply_activity TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_auto_apply_status TO authenticated;

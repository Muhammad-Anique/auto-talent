-- Migration: Reset existing users to FREE plan and clear their content
-- Run this ONCE in Supabase SQL Editor after deploying the new credit system

-- 1. Create usage_tracking table if it doesn't exist
CREATE TABLE IF NOT EXISTS usage_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_id ON usage_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_action_type ON usage_tracking(action_type);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_action ON usage_tracking(user_id, action_type);

-- RLS for usage_tracking
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'usage_tracking' AND policyname = 'Users can view own usage') THEN
        CREATE POLICY "Users can view own usage" ON usage_tracking FOR SELECT USING (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'usage_tracking' AND policyname = 'Users can insert own usage') THEN
        CREATE POLICY "Users can insert own usage" ON usage_tracking FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

GRANT ALL ON usage_tracking TO authenticated;

-- 2. Reset all users WITHOUT an active paid subscription to FREE
-- (Users who have already paid keep their plan)
UPDATE subscriptions
SET plan_type = 'free',
    subscription_status = NULL,
    updated_at = now()
WHERE plan_type NOT IN ('pro', 'lifetime', 'starter')
   OR plan_type IS NULL;

-- 3. Delete all resumes for FREE users (users without active paid plans)
DELETE FROM resumes
WHERE user_id IN (
    SELECT s.user_id FROM subscriptions s
    WHERE s.plan_type = 'free' OR s.plan_type IS NULL
)
OR user_id NOT IN (SELECT user_id FROM subscriptions);

-- 4. Delete all cover letters for FREE users
DELETE FROM cover_letters
WHERE user_id IN (
    SELECT s.user_id FROM subscriptions s
    WHERE s.plan_type = 'free' OR s.plan_type IS NULL
)
OR user_id NOT IN (SELECT user_id FROM subscriptions);

-- 5. Delete all interview questions for FREE users
DELETE FROM interview_questions
WHERE user_id IN (
    SELECT s.user_id FROM subscriptions s
    WHERE s.plan_type = 'free' OR s.plan_type IS NULL
)
OR user_id NOT IN (SELECT user_id FROM subscriptions);

-- 6. Delete all follow-up emails for FREE users
DELETE FROM email_hr
WHERE user_id IN (
    SELECT s.user_id FROM subscriptions s
    WHERE s.plan_type = 'free' OR s.plan_type IS NULL
)
OR user_id NOT IN (SELECT user_id FROM subscriptions);

-- 7. Clear usage tracking for FREE users (fresh start)
DELETE FROM usage_tracking
WHERE user_id IN (
    SELECT s.user_id FROM subscriptions s
    WHERE s.plan_type = 'free' OR s.plan_type IS NULL
)
OR user_id NOT IN (SELECT user_id FROM subscriptions);

-- 8. Ensure all auth users have a subscription record
INSERT INTO subscriptions (user_id, plan_type, updated_at)
SELECT id, 'free', now()
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM subscriptions)
ON CONFLICT (user_id) DO NOTHING;

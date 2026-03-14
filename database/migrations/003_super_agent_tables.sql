-- Super Agent Database Schema
-- Adds conversation persistence and artifact storage

-- Agent Conversations Table
CREATE TABLE IF NOT EXISTS agent_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT,
    messages JSONB DEFAULT '[]',
    current_artifact JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Artifacts Table
CREATE TABLE IF NOT EXISTS artifacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    conversation_id UUID REFERENCES agent_conversations(id) ON DELETE SET NULL,
    type TEXT NOT NULL CHECK (type IN ('resume', 'cover_letter', 'email', 'document')),
    title TEXT,
    html TEXT NOT NULL,
    language TEXT DEFAULT 'en',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_agent_conversations_user_id ON agent_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_conversations_updated_at ON agent_conversations(updated_at);
CREATE INDEX IF NOT EXISTS idx_artifacts_user_id ON artifacts(user_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_conversation_id ON artifacts(conversation_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_type ON artifacts(type);

-- Row Level Security
ALTER TABLE agent_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE artifacts ENABLE ROW LEVEL SECURITY;

-- Agent Conversations Policies
CREATE POLICY "Users can view own agent conversations" ON agent_conversations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own agent conversations" ON agent_conversations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own agent conversations" ON agent_conversations
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own agent conversations" ON agent_conversations
    FOR DELETE USING (auth.uid() = user_id);

-- Artifacts Policies
CREATE POLICY "Users can view own artifacts" ON artifacts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own artifacts" ON artifacts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own artifacts" ON artifacts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own artifacts" ON artifacts
    FOR DELETE USING (auth.uid() = user_id);

-- Updated at triggers
CREATE TRIGGER update_agent_conversations_updated_at
    BEFORE UPDATE ON agent_conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_artifacts_updated_at
    BEFORE UPDATE ON artifacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grants
GRANT ALL ON agent_conversations TO authenticated;
GRANT ALL ON artifacts TO authenticated;

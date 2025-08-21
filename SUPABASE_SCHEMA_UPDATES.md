# Supabase Schema Updates for Credits System

## Database Changes Required

### 1. Update `users` table

The `users` table already has a `credits` column. If it doesn't exist, add it:

```sql
-- Add credits column to users table (if not already exists)
ALTER TABLE users 
ADD COLUMN credits INTEGER DEFAULT 0;

-- Update existing records to have 0 credits
UPDATE users 
SET credits = 0 
WHERE credits IS NULL;
```

### 2. Complete `users` table schema

Your `users` table structure:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  email TEXT,
  username TEXT,
  plan_sub TEXT,
  "Auto-Apply" BOOLEAN,
  last_auto_applied TIMESTAMP WITH TIME ZONE,
  credits INTEGER DEFAULT 0
);
```

### 3. Add RLS (Row Level Security) policies

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Policy for users to update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Policy for inserting new user records
CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);
```

## Functionality Implemented

### 1. Credits System
- Users need 10 credits to submit a new auto-apply configuration
- Credits are deducted when a new configuration is submitted
- Credits are NOT deducted when editing an existing configuration
- Test button adds 10 credits for development purposes

### 2. One Form Per User Limit
- Users can only have one auto-apply configuration at a time
- Users can edit their existing configuration
- Users must delete their existing configuration to create a new one

### 3. UI Updates
- Credits display on dashboard and form pages
- Warning messages when credits are insufficient
- Disabled buttons when requirements are not met
- Test credits button for development

## Usage

1. **Adding Test Credits**: Click "Add 10 Test Credits" button on dashboard
2. **Creating Configuration**: Need 10 credits and no existing configuration
3. **Editing Configuration**: No credits required, can edit existing configuration
4. **Deleting Configuration**: No credits required, can delete to create new one

## Notes

- Credits are stored in the `users` table alongside user information
- The system automatically creates a user record for new users
- Credits start at 0 for new users
- The test button is for development purposes only

-- Reading Phonics App - Supabase Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Pack progress table
-- Stores word progress for each user and pack
CREATE TABLE IF NOT EXISTS pack_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pack_id INTEGER NOT NULL,
  words JSONB NOT NULL DEFAULT '{}',
  completed BOOLEAN DEFAULT FALSE,
  last_reviewed TIMESTAMPTZ,
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, pack_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_pack_progress_user_id ON pack_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_pack_progress_pack_id ON pack_progress(pack_id);
CREATE INDEX IF NOT EXISTS idx_pack_progress_last_reviewed ON pack_progress(last_reviewed);

-- Enable Row Level Security
ALTER TABLE pack_progress ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own progress" ON pack_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON pack_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON pack_progress;
DROP POLICY IF EXISTS "Users can delete own progress" ON pack_progress;

-- RLS Policies: Users can only access their own data
CREATE POLICY "Users can view own progress"
  ON pack_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON pack_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON pack_progress FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress"
  ON pack_progress FOR DELETE
  USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_pack_progress_updated_at ON pack_progress;
CREATE TRIGGER update_pack_progress_updated_at
  BEFORE UPDATE ON pack_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create a view for easy querying of user statistics
CREATE OR REPLACE VIEW user_pack_statistics AS
SELECT
  user_id,
  COUNT(DISTINCT pack_id) as total_packs_started,
  COUNT(DISTINCT pack_id) FILTER (WHERE completed = true) as packs_completed,
  MAX(last_reviewed) as last_activity
FROM pack_progress
GROUP BY user_id;

-- Grant access to authenticated users
GRANT SELECT ON user_pack_statistics TO authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Database schema created successfully!';
  RAISE NOTICE 'Tables: pack_progress';
  RAISE NOTICE 'Views: user_pack_statistics';
  RAISE NOTICE 'RLS Policies: Enabled and configured';
END $$;

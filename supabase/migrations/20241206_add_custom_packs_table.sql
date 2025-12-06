-- Migration: Add custom_packs table for syncing user-created word packs
-- Run this in your Supabase SQL editor

-- Create the custom_packs table
CREATE TABLE IF NOT EXISTS custom_packs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  local_id TEXT NOT NULL, -- C1, C2, C3...
  name TEXT NOT NULL,
  words TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure each user can only have one pack with a given local_id
  UNIQUE(user_id, local_id)
);

-- Create index for faster lookups by user
CREATE INDEX IF NOT EXISTS idx_custom_packs_user_id ON custom_packs(user_id);

-- Enable Row Level Security
ALTER TABLE custom_packs ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see their own custom packs
CREATE POLICY "Users can view own custom packs" ON custom_packs
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy: Users can insert their own custom packs
CREATE POLICY "Users can insert own custom packs" ON custom_packs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can update their own custom packs
CREATE POLICY "Users can update own custom packs" ON custom_packs
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policy: Users can delete their own custom packs
CREATE POLICY "Users can delete own custom packs" ON custom_packs
  FOR DELETE
  USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON custom_packs TO authenticated;
GRANT ALL ON custom_packs TO service_role;

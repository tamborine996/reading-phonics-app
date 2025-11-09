/**
 * Enable RLS via Direct Database Connection
 *
 * This script connects directly to your Supabase PostgreSQL database
 * and runs the RLS migration SQL.
 *
 * Usage:
 *   npm run enable:rls
 */

import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;

// Get database URL from environment
const DATABASE_URL = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('\n❌ Missing database connection string!\n');
  console.error('You need to set one of these environment variables:');
  console.error('  - SUPABASE_DB_URL');
  console.error('  - DATABASE_URL\n');
  console.error('Get it from Supabase Dashboard → Settings → Database → Connection String\n');
  console.error('Example format:');
  console.error('  postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres\n');
  console.error('Then run:');
  console.error('  SUPABASE_DB_URL="your-connection-string" npm run enable:rls\n');
  process.exit(1);
}

async function enableRLS() {
  console.log('\n🔒 Enabling Row Level Security...\n');

  // Create database connection pool
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Supabase uses SSL
    },
  });

  try {
    console.log('📡 Connecting to database...');
    const client = await pool.connect();
    console.log('✅ Connected successfully\n');

    // Enable RLS
    console.log('🔧 Enabling RLS on pack_progress table...');
    await client.query('ALTER TABLE pack_progress ENABLE ROW LEVEL SECURITY;');
    console.log('✅ RLS enabled\n');

    // Drop existing policies
    console.log('🧹 Dropping old policies (if any)...');
    await client.query('DROP POLICY IF EXISTS "Users can view own progress" ON pack_progress;');
    await client.query('DROP POLICY IF EXISTS "Users can insert own progress" ON pack_progress;');
    await client.query('DROP POLICY IF EXISTS "Users can update own progress" ON pack_progress;');
    await client.query('DROP POLICY IF EXISTS "Users can delete own progress" ON pack_progress;');
    console.log('✅ Old policies dropped\n');

    // Create SELECT policy
    console.log('📝 Creating SELECT policy...');
    await client.query(`
      CREATE POLICY "Users can view own progress"
      ON pack_progress FOR SELECT
      USING (auth.uid() = user_id);
    `);
    console.log('✅ SELECT policy created');

    // Create INSERT policy
    console.log('📝 Creating INSERT policy...');
    await client.query(`
      CREATE POLICY "Users can insert own progress"
      ON pack_progress FOR INSERT
      WITH CHECK (auth.uid() = user_id);
    `);
    console.log('✅ INSERT policy created');

    // Create UPDATE policy
    console.log('📝 Creating UPDATE policy...');
    await client.query(`
      CREATE POLICY "Users can update own progress"
      ON pack_progress FOR UPDATE
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
    `);
    console.log('✅ UPDATE policy created');

    // Create DELETE policy
    console.log('📝 Creating DELETE policy...');
    await client.query(`
      CREATE POLICY "Users can delete own progress"
      ON pack_progress FOR DELETE
      USING (auth.uid() = user_id);
    `);
    console.log('✅ DELETE policy created\n');

    // Verify RLS is enabled
    console.log('🔍 Verifying RLS status...');
    const rlsCheck = await client.query(`
      SELECT tablename, rowsecurity
      FROM pg_tables
      WHERE tablename = 'pack_progress';
    `);

    if (rlsCheck.rows[0]?.rowsecurity) {
      console.log('✅ RLS is ENABLED\n');
    } else {
      console.error('❌ RLS verification failed!\n');
      process.exit(1);
    }

    // List all policies
    console.log('📋 Listing RLS policies:');
    const policies = await client.query(`
      SELECT policyname, cmd
      FROM pg_policies
      WHERE tablename = 'pack_progress'
      ORDER BY cmd;
    `);

    policies.rows.forEach((row) => {
      console.log(`  ✓ ${row.cmd}: ${row.policyname}`);
    });

    console.log('\n═══════════════════════════════════════════════\n');
    console.log('✅ RLS SUCCESSFULLY ENABLED!\n');
    console.log('Next steps:');
    console.log('  1. Run: npm run check:rls');
    console.log('  2. Test with multiple Google accounts\n');

    client.release();
  } catch (error) {
    console.error('\n❌ Error enabling RLS:', error);

    if (error instanceof Error) {
      if (error.message.includes('connect')) {
        console.error('\n💡 Connection failed. Check your DATABASE_URL:');
        console.error('  - Is the password correct?');
        console.error('  - Is the project ref correct?');
        console.error('  - Can you access Supabase from this network?\n');
      } else if (error.message.includes('permission')) {
        console.error('\n💡 Permission denied. Make sure:');
        console.error('  - You are using the postgres role connection string');
        console.error('  - Not the pooler connection string\n');
      }
    }

    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the script
enableRLS();

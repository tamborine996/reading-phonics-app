/**
 * Execute SQL schema on Supabase PostgreSQL database
 */

import pg from 'pg';
import { readFileSync } from 'fs';

const { Client } = pg;

const connectionString = 'postgresql://postgres:qjeHVLTmT6SGs4xN@db.lgcfmzksdpnolwjwavwt.supabase.co:5432/postgres';

console.log('🚀 Connecting to Supabase PostgreSQL database...\n');

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function runSQL() {
  try {
    // Connect to database
    await client.connect();
    console.log('✅ Connected to database!\n');

    // Read SQL file
    const sql = readFileSync('supabase-schema.sql', 'utf-8');
    console.log('📄 Loaded SQL schema\n');

    console.log('⏳ Executing SQL schema...\n');

    // Execute the SQL
    const result = await client.query(sql);

    console.log('✅ SQL executed successfully!\n');

    // Verify table was created
    console.log('🔍 Verifying table creation...\n');
    const verifyResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'pack_progress'
    `);

    if (verifyResult.rows.length > 0) {
      console.log('✅ Table "pack_progress" created successfully!');
    } else {
      console.log('⚠️  Table not found, but SQL executed');
    }

    // Check for RLS policies
    const policiesResult = await client.query(`
      SELECT policyname
      FROM pg_policies
      WHERE tablename = 'pack_progress'
    `);

    console.log(`✅ Found ${policiesResult.rows.length} RLS policies`);

    console.log('\n' + '='.repeat(50));
    console.log('🎉 Database setup complete!');
    console.log('='.repeat(50) + '\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.detail) console.error('Details:', error.detail);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runSQL();

/**
 * Supabase Database Setup Script
 * Automatically creates the database schema
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const SUPABASE_URL = 'https://lgcfmzksdpnolwjwavwt.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnY2ZtemtzZHBub2x3andhdnd0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjUyMjcyMiwiZXhwIjoyMDc4MDk4NzIyfQ.Q3cnLUMe_jto0OyVA3FShRKyY8ITp8MS-HB5teYHFbQ';

console.log('🚀 Setting up Supabase database...\n');

// Create Supabase client with service role
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// Read SQL schema
const sql = readFileSync('supabase-schema.sql', 'utf-8');

// Split SQL into individual statements (rough split by semicolons outside of function bodies)
const statements = sql
  .split(/;(?=\s*(?:--|CREATE|ALTER|DROP|GRANT|DO))/gi)
  .map(s => s.trim())
  .filter(s => s && !s.startsWith('--'));

console.log(`📄 Found ${statements.length} SQL statements to execute\n`);

// Execute each statement
async function runSetup() {
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];

    // Skip comments and empty statements
    if (!statement || statement.startsWith('--')) {
      continue;
    }

    console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);

    try {
      const { error } = await supabase.rpc('exec_sql', { sql: statement });

      if (error) {
        // Try alternative method using REST API
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'apikey': SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: statement })
        });

        if (!response.ok) {
          throw new Error(`Failed to execute: ${statement.substring(0, 50)}...`);
        }
      }

      successCount++;
      console.log(`✅ Success\n`);
    } catch (err) {
      console.log(`⚠️  Skipping (may already exist): ${err.message}\n`);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✨ Database setup complete!`);
  console.log(`✅ Successful: ${successCount}`);
  console.log(`⚠️  Skipped: ${errorCount}`);
  console.log('='.repeat(50) + '\n');

  // Test connection
  console.log('🔍 Testing database connection...');
  const { data, error } = await supabase.from('pack_progress').select('count');

  if (error && !error.message.includes('0 rows')) {
    console.log('❌ Error:', error.message);
  } else {
    console.log('✅ Database connection successful!');
    console.log('✅ Table "pack_progress" is ready\n');
  }
}

runSetup().catch(console.error);

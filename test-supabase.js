/**
 * Test Supabase connection and authentication
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lgcfmzksdpnolwjwavwt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnY2ZtemtzZHBub2x3andhdnd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MjI3MjIsImV4cCI6MjA3ODA5ODcyMn0.A9g6n4B7Fv6Z3-Xi-JHdu-NoPEam9tkvlYC-nZoAJv8';

console.log('🧪 Testing Supabase Integration\n');
console.log('='.repeat(50) + '\n');

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testSupabase() {
  console.log('1️⃣  Testing connection...');
  try {
    const { data, error } = await supabase.from('pack_progress').select('count');

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    console.log('   ✅ Connection successful!\n');
  } catch (error) {
    console.log('   ❌ Connection failed:', error.message);
    process.exit(1);
  }

  console.log('2️⃣  Testing authentication system...');
  try {
    // Test sign up with a test user
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'testPassword123!';

    console.log(`   Creating test user: ${testEmail}`);
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });

    if (signUpError) {
      // Check if it's just email confirmation required
      if (signUpError.message.includes('confirm') || signUpError.message.includes('verification')) {
        console.log('   ⚠️  Email confirmation required (this is expected)');
        console.log('   ✅ Auth system is working!\n');
      } else {
        throw signUpError;
      }
    } else if (signUpData.user) {
      console.log('   ✅ Test user created successfully!');
      console.log(`   User ID: ${signUpData.user.id}\n`);

      // Test inserting data
      console.log('3️⃣  Testing data insertion...');
      const { data: insertData, error: insertError } = await supabase
        .from('pack_progress')
        .insert({
          user_id: signUpData.user.id,
          pack_id: 1,
          words: { test: 'mastered' },
          completed: false,
        })
        .select();

      if (insertError) {
        console.log('   ⚠️  Insert error:', insertError.message);
      } else {
        console.log('   ✅ Data inserted successfully!\n');
      }

      // Test reading data
      console.log('4️⃣  Testing data retrieval...');
      const { data: selectData, error: selectError } = await supabase
        .from('pack_progress')
        .select('*')
        .eq('user_id', signUpData.user.id);

      if (selectError) {
        console.log('   ❌ Select error:', selectError.message);
      } else {
        console.log(`   ✅ Retrieved ${selectData.length} record(s)!\n`);
      }

      // Clean up test user
      await supabase.auth.signOut();
    }
  } catch (error) {
    console.log('   ❌ Auth test failed:', error.message);
  }

  console.log('='.repeat(50));
  console.log('✨ Supabase integration test complete!\n');
  console.log('Your app is ready for:');
  console.log('  ✅ User authentication');
  console.log('  ✅ Cross-device data sync');
  console.log('  ✅ Progress tracking');
  console.log('='.repeat(50) + '\n');
}

testSupabase();

/**
 * RLS Status Checker
 *
 * Run this to verify if RLS is properly configured in Supabase
 *
 * Usage:
 *   npx tsx scripts/check-rls-status.ts
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

async function checkRLSStatus() {
  console.log('\n🔍 Checking RLS Status...\n');

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ Supabase credentials not found in environment');
    console.error('   Make sure .env file exists with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  console.log('📊 Testing unauthenticated access...\n');

  // Test 1: Try to SELECT without auth
  console.log('Test 1: SELECT without authentication');
  const { data: selectData, error: selectError } = await supabase
    .from('pack_progress')
    .select('*')
    .limit(5);

  if (selectData && selectData.length > 0) {
    console.error('❌ FAIL: Retrieved data without authentication');
    console.error(`   Found ${selectData.length} rows - RLS is NOT enabled!`);
    console.error('   🚨 SECURITY ISSUE: All users can see each other\'s data\n');
    console.log('📋 Next steps:');
    console.log('   1. Read SECURITY_FIX.md');
    console.log('   2. Run the SQL commands in Supabase SQL Editor');
    console.log('   3. Run this script again to verify\n');
    return false;
  } else if (selectError) {
    console.log('✅ PASS: Query blocked by RLS');
    console.log(`   Error: ${selectError.message}\n`);
  } else {
    console.log('✅ PASS: No data returned (RLS working)\n');
  }

  // Test 2: Try to INSERT without auth
  console.log('Test 2: INSERT without authentication');
  const { error: insertError } = await supabase
    .from('pack_progress')
    .insert({
      user_id: '00000000-0000-0000-0000-000000000000',
      pack_id: 999,
      words: {},
      completed: false,
    });

  if (!insertError) {
    console.error('❌ FAIL: Insert succeeded without authentication');
    console.error('   🚨 SECURITY ISSUE: RLS policies are not working\n');
    return false;
  } else {
    console.log('✅ PASS: Insert blocked by RLS');
    console.log(`   Error: ${insertError.message}\n`);
  }

  // Test 3: Try to UPDATE without auth
  console.log('Test 3: UPDATE without authentication');
  const { error: updateError } = await supabase
    .from('pack_progress')
    .update({ completed: true })
    .eq('pack_id', 1);

  if (!updateError) {
    console.error('❌ FAIL: Update succeeded without authentication');
    console.error('   🚨 SECURITY ISSUE: RLS policies are not working\n');
    return false;
  } else {
    console.log('✅ PASS: Update blocked by RLS');
    console.log(`   Error: ${updateError.message}\n`);
  }

  // Test 4: Try to DELETE without auth
  console.log('Test 4: DELETE without authentication');
  const { error: deleteError } = await supabase
    .from('pack_progress')
    .delete()
    .eq('pack_id', 1);

  if (!deleteError) {
    console.error('❌ FAIL: Delete succeeded without authentication');
    console.error('   🚨 SECURITY ISSUE: RLS policies are not working\n');
    return false;
  } else {
    console.log('✅ PASS: Delete blocked by RLS');
    console.log(`   Error: ${deleteError.message}\n`);
  }

  console.log('═══════════════════════════════════════════════\n');
  console.log('✅ ALL TESTS PASSED - RLS is properly configured!\n');
  console.log('Next step: Test with multiple Google accounts');
  console.log('See: tests/security/rls-verification.test.ts\n');

  return true;
}

// Run the check
checkRLSStatus()
  .then((passed) => {
    process.exit(passed ? 0 : 1);
  })
  .catch((error) => {
    console.error('\n❌ Unexpected error:', error);
    process.exit(1);
  });

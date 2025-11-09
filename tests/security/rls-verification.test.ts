/**
 * RLS (Row Level Security) Verification Test
 *
 * This test verifies that:
 * 1. RLS is enabled on pack_progress table
 * 2. Users can only see their own data
 * 3. Users cannot access other users' data
 *
 * IMPORTANT: This test requires manual setup:
 * - Two different Google accounts
 * - Supabase RLS policies enabled
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env, isSupabaseConfigured } from '@/env';

describe('RLS Security Verification', () => {
  let supabase: SupabaseClient;

  beforeAll(() => {
    if (!isSupabaseConfigured()) {
      console.warn('⚠️  Supabase not configured - skipping RLS tests');
      return;
    }

    supabase = createClient(env.SUPABASE_URL!, env.SUPABASE_ANON_KEY!);
  });

  it('should have Supabase configured', () => {
    expect(isSupabaseConfigured()).toBe(true);
  });

  it('should verify RLS is enabled on pack_progress table', async () => {
    if (!isSupabaseConfigured()) {
      console.warn('⚠️  Skipping: Supabase not configured');
      return;
    }

    // This query checks if RLS is enabled
    // If RLS is disabled, this will return data even without auth
    // If RLS is enabled, this will return an error or empty data
    const { data: rows, error } = await supabase
      .from('pack_progress')
      .select('*')
      .limit(1);

    // Without authentication, we should get an error or no data (RLS blocking)
    // If we get data back, RLS is NOT working properly
    console.log('🔒 RLS Test Result:', {
      hasData: !!rows && rows.length > 0,
      hasError: !!error,
      error: error?.message
    });

    // RLS should either return empty data or an auth error
    if (rows && rows.length > 0) {
      console.error('🚨 SECURITY ISSUE: Retrieved data without authentication!');
      console.error('   This means RLS is NOT enabled properly.');
      console.error('   Run SECURITY_FIX.md instructions immediately.');
      expect(rows.length).toBe(0); // This will fail to alert you
    } else {
      console.log('✅ RLS appears to be working - no data without auth');
      expect(true).toBe(true);
    }
  });

  it('should not allow unauthenticated INSERT', async () => {
    if (!isSupabaseConfigured()) {
      console.warn('⚠️  Skipping: Supabase not configured');
      return;
    }

    // Try to insert data without authentication
    const { error } = await supabase
      .from('pack_progress')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000000', // Fake UUID
        pack_id: 1,
        words: {},
        completed: false,
      });

    // Should get an error because of RLS
    console.log('🔒 INSERT Test:', {
      success: !error,
      error: error?.message
    });

    if (!error) {
      console.error('🚨 SECURITY ISSUE: Insert succeeded without authentication!');
      console.error('   RLS policies are NOT working.');
    } else {
      console.log('✅ RLS blocking unauthenticated INSERT');
    }

    expect(error).toBeTruthy(); // Should have an error
  });

  it('should not allow unauthenticated UPDATE', async () => {
    if (!isSupabaseConfigured()) {
      console.warn('⚠️  Skipping: Supabase not configured');
      return;
    }

    // Try to update data without authentication
    const { error } = await supabase
      .from('pack_progress')
      .update({ completed: true })
      .eq('pack_id', 1);

    console.log('🔒 UPDATE Test:', {
      success: !error,
      error: error?.message
    });

    if (!error) {
      console.error('🚨 SECURITY ISSUE: Update succeeded without authentication!');
      console.error('   RLS policies are NOT working.');
    } else {
      console.log('✅ RLS blocking unauthenticated UPDATE');
    }

    expect(error).toBeTruthy(); // Should have an error
  });

  it('should not allow unauthenticated DELETE', async () => {
    if (!isSupabaseConfigured()) {
      console.warn('⚠️  Skipping: Supabase not configured');
      return;
    }

    // Try to delete data without authentication
    const { error } = await supabase
      .from('pack_progress')
      .delete()
      .eq('pack_id', 1);

    console.log('🔒 DELETE Test:', {
      success: !error,
      error: error?.message
    });

    if (!error) {
      console.error('🚨 SECURITY ISSUE: Delete succeeded without authentication!');
      console.error('   RLS policies are NOT working.');
    } else {
      console.log('✅ RLS blocking unauthenticated DELETE');
    }

    expect(error).toBeTruthy(); // Should have an error
  });
});

/**
 * Manual Multi-User Isolation Test
 *
 * This test requires manual steps:
 *
 * 1. Open app in Browser 1 (Incognito/Private)
 *    - Sign in with Google Account A
 *    - Practice Pack 1, mark 5 words as tricky
 *    - Note the progress
 *
 * 2. Open app in Browser 2 (Different Incognito/Private)
 *    - Sign in with Google Account B
 *    - Check Pack 1 progress
 *    - EXPECTED: Should show 0 words marked (fresh start)
 *    - FAILURE: If you see Account A's 5 tricky words, RLS is broken
 *
 * 3. In Browser 2:
 *    - Practice Pack 1, mark 3 words as mastered
 *
 * 4. Switch back to Browser 1:
 *    - Refresh the page
 *    - Check Pack 1 progress
 *    - EXPECTED: Should still show original 5 tricky words
 *    - FAILURE: If you see Account B's data, RLS is broken
 *
 * If both tests pass, RLS is working correctly! ✅
 */

describe('Manual Multi-User Test Instructions', () => {
  it('should display test instructions', () => {
    console.log('\n📋 MANUAL MULTI-USER TEST INSTRUCTIONS:\n');
    console.log('1. Browser 1 (Incognito): Sign in with Account A → Practice → Mark words');
    console.log('2. Browser 2 (Incognito): Sign in with Account B → Check progress');
    console.log('   ✅ PASS: Account B sees empty progress');
    console.log('   ❌ FAIL: Account B sees Account A\'s data');
    console.log('\n3. Browser 2: Practice and mark different words');
    console.log('4. Browser 1: Refresh and verify original data unchanged');
    console.log('   ✅ PASS: Account A still sees only their own data');
    console.log('   ❌ FAIL: Account A sees Account B\'s data\n');

    expect(true).toBe(true);
  });
});



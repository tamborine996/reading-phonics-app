/**
 * Verify Supabase anon key is correct
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lgcfmzksdpnolwjwavwt.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnY2ZtemtzZHBub2x3andhdnd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MjI3MjIsImV4cCI6MjA3ODA5ODcyMn0.A9g6n4B7Fv6Z3-Xi-JHdu-NoPEam9tkvlYC-nZoAJv8';

console.log('🔍 Verifying Supabase Anon Key...\n');
console.log('URL:', SUPABASE_URL);
console.log('Key (first 50 chars):', ANON_KEY.substring(0, 50) + '...\n');

const supabase = createClient(SUPABASE_URL, ANON_KEY);

async function verify() {
  try {
    console.log('⏳ Testing connection with anon key...\n');

    // Try to query the database
    const { data, error } = await supabase
      .from('pack_progress')
      .select('count');

    if (error) {
      if (error.code === 'PGRST301') {
        console.log('❌ INVALID KEY!');
        console.log('Error:', error.message);
        console.log('\nThe anon key is incorrect or expired.\n');
        console.log('To get the correct key:');
        console.log('1. Go to: https://lgcfmzksdpnolwjwavwt.supabase.co/project/lgcfmzksdpnolwjwavwt/settings/api');
        console.log('2. Copy the "anon" "public" key\n');
        process.exit(1);
      } else if (error.code === 'PGRST116') {
        // This is fine - just means no data yet
        console.log('✅ ANON KEY IS CORRECT!');
        console.log('Connection successful (table is empty, which is expected)\n');
      } else {
        console.log('⚠️  Connection works but got error:', error.message);
        console.log('This might still mean the key is correct.\n');
      }
    } else {
      console.log('✅ ANON KEY IS CORRECT!');
      console.log('Connection successful!\n');
    }

    // Verify key details by decoding JWT
    const [, payload] = ANON_KEY.split('.');
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());

    console.log('Key Details:');
    console.log('  Role:', decoded.role);
    console.log('  Project:', decoded.ref);
    console.log('  Issued:', new Date(decoded.iat * 1000).toISOString());
    console.log('  Expires:', new Date(decoded.exp * 1000).toISOString());

    if (decoded.role !== 'anon') {
      console.log('\n⚠️  WARNING: This is NOT an anon key!');
      console.log('Current role:', decoded.role);
      console.log('Expected role: anon\n');
    }

  } catch (error) {
    console.log('❌ FAILED TO CONNECT');
    console.log('Error:', error.message);
    console.log('\nThe key might be invalid.\n');
    process.exit(1);
  }
}

verify();

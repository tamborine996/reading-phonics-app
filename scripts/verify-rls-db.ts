import pg from 'pg';
const { Pool } = pg;

const DATABASE_URL = process.env.SUPABASE_DB_URL;

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const client = await pool.connect();

// Check RLS is enabled
const rls = await client.query("SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'pack_progress'");
console.log('RLS Enabled:', rls.rows[0]?.rowsecurity);

// Check policies
const policies = await client.query("SELECT policyname, cmd FROM pg_policies WHERE tablename = 'pack_progress' ORDER BY cmd");
console.log('\nPolicies:');
policies.rows.forEach(p => console.log(`  ${p.cmd}: ${p.policyname}`));

// Check if there's any data
const count = await client.query('SELECT COUNT(*) FROM pack_progress');
console.log('\nRows in table:', count.rows[0].count);

client.release();
await pool.end();

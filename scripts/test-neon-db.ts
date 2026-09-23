import { Pool } from 'pg';

const connectionString = 'postgresql://neondb_owner:npg_N3PsaDziloM4@ep-cold-paper-b5liftd3-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function testConnection() {
  console.log('Testing connection to Neon PostgreSQL...');
  const client = await pool.connect();
  console.log('✅ Successfully connected to Neon PostgreSQL!');

  const res = await client.query('SELECT current_database(), current_user, version()');
  console.log('Database Info:', res.rows[0]);

  // List all tables
  const tablesRes = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `);

  console.log('\nExisting Tables in Neon DB:');
  tablesRes.rows.forEach(r => console.log(' -', r.table_name));

  // Check live show state
  const stateRes = await client.query('SELECT * FROM live_show_state');
  console.log('\nLive Show State:', stateRes.rows);

  // Check judges
  const judgesRes = await client.query('SELECT slot_number, name, pin FROM live_judges ORDER BY slot_number ASC');
  console.log('\nJudges in Neon DB:');
  judgesRes.rows.forEach(j => console.log(` [Seat ${j.slot_number}] ${j.name} (PIN: ${j.pin})`));

  client.release();
  await pool.end();
  console.log('\n✅ Neon DB test completed successfully!');
}

testConnection().catch(err => {
  console.error('❌ Connection error:', err);
  process.exit(1);
});

import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

async function checkTables() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not defined');
    return;
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    console.log('Querying information_schema.tables...');
    const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    console.log('Tables found:', tables);

    console.log('Describing users table...');
    const columns = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users'`;
    console.log('Columns found:', columns);

    console.log('Querying users table count...');
    const count = await sql`SELECT count(*) FROM users`;
    console.log('Users count:', count);
  } catch (error) {
    console.error('Operation failed:', error);
  }
}

checkTables();

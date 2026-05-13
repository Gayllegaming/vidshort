import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './db/schema';

async function testDb() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not defined');
    return;
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql, { schema });

  try {
    console.log('Fetching users...');
    const users = await db.select().from(schema.Users).limit(1);
    console.log('Users found:', users);
  } catch (error) {
    console.error('Query failed:', error);
  }
}

testDb();

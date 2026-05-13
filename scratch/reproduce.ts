import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

async function reproduce() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not defined');
    return;
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    console.log('Running the failing query...');
    const result = await sql`select "id", "clerk_id", "email", "name", "image_url", "created_at", "updated_at" from "users" "Users" where "Users"."clerk_id" = ${'user_3DJlsqLuWt8YsRDCgbU4GQA8YQT'} limit 1`;
    console.log('Result:', result);
  } catch (error) {
    console.error('Query failed:', error);
  }
}

reproduce();

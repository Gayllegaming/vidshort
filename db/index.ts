import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

const connectionString = process.env.DATABASE_URL;

const globalForDrizzle = globalThis as unknown as {
  client: postgres.Sql | undefined;
  db_v2: ReturnType<typeof drizzle> | undefined;
};

const client = globalForDrizzle.client ?? postgres(connectionString, {
  prepare: false, // Required for some serverless/pooling environments like Neon
});
export const db = globalForDrizzle.db_v2 ?? drizzle(client, { schema });

if (process.env.NODE_ENV !== "production") {
  globalForDrizzle.client = client;
  globalForDrizzle.db_v2 = db;
}

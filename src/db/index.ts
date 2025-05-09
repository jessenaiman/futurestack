import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { config } from 'dotenv';
import ws from 'ws';
import { neonConfig } from '@neondatabase/serverless';

// Load environment variables
config();

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
}

// Configure WebSocket support for Node.js
neonConfig.webSocketConstructor = ws;

// Create Neon SQL client
const sql = neon(process.env.DATABASE_URL);

// Create Drizzle instance with neon-http adapter
export const db = drizzle(sql);
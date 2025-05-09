import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { pgvectorSetup } from "./schema";
import { sql } from "drizzle-orm";

// Load environment variables
config({ path: ".env" });

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
}

// Set up Jina reranker configuration
const JINA_API_KEY = "jina_6f9719af1b814378a1405003d2d639fajIc9gW6laO5iDbtvxrMyOx_zCdkZ";

// Create Neon SQL client
const sqlClient = neon(process.env.DATABASE_URL);
const db = drizzle({ client: sqlClient });

// Initialize database with required extensions and schemas
async function initializeDatabase() {
    try {
        // Enable pgvector extension
        await db.execute(pgvectorSetup);
        console.log('✓ Enabled pgvector extension');

        // Enable pgrag extensions
        await db.execute(sql`CREATE EXTENSION IF NOT EXISTS rag CASCADE`);
        await db.execute(sql`CREATE EXTENSION IF NOT EXISTS rag_bge_small_en_v15 CASCADE`);
        await db.execute(sql`CREATE EXTENSION IF NOT EXISTS rag_jina_reranker_v1_tiny_en CASCADE`);
        console.log('✓ Enabled pgrag and related extensions');

        // Run migrations
        await migrate(db, { migrationsFolder: './migrations' });
        console.log('✓ Applied database migrations');

        // Create vector indexes
        await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_documents_embedding ON documents USING ivfflat (embedding vector_cosine_ops);
      CREATE INDEX IF NOT EXISTS idx_conversations_embedding ON conversations USING ivfflat (embedding vector_cosine_ops);
      CREATE INDEX IF NOT EXISTS idx_memories_embedding ON memories USING ivfflat (embedding vector_cosine_ops);
    `);
        console.log('✓ Created vector indexes');

        console.log('Database initialization complete!');
    } catch (error) {
        console.error('Error during database initialization:', error);
        throw error;
    }
}

// Export the database client
export { db };
export default db;

// Initialize if this is the main module
if (require.main === module) {
    initializeDatabase().catch((error) => {
        console.error('Fatal error during initialization:', error);
        process.exit(1);
    });
}
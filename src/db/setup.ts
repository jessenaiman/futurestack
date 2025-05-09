import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
import ws from 'ws';
import { neonConfig } from '@neondatabase/serverless';

// Load environment variables
config();

// Configure WebSocket support for Node.js
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
}

// Create Neon SQL client
export const sql = neon(process.env.DATABASE_URL);

// Initialize pgrag and required extensions
export async function setupPgrag() {
    try {
        console.log('Setting up required extensions...');
        await sql`SET neon.allow_unstable_extensions='true'`;
        await sql`CREATE EXTENSION IF NOT EXISTS vector CASCADE`;
        await sql`CREATE EXTENSION IF NOT EXISTS rag CASCADE`;
        await sql`CREATE EXTENSION IF NOT EXISTS rag_bge_small_en_v15 CASCADE`;
        await sql`CREATE EXTENSION IF NOT EXISTS rag_jina_reranker_v1_tiny_en CASCADE`;
        console.log('Extensions setup complete');

        // Create docs table
        console.log('Creating docs table...');
        await sql`
      CREATE TABLE IF NOT EXISTS docs (
        id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name text NOT NULL,
        fulltext text NOT NULL
      )
    `;

        // Create embeddings table with HNSW vector index
        console.log('Creating embeddings table...');
        await sql`
      CREATE TABLE IF NOT EXISTS embeddings (
        id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        doc_id int NOT NULL REFERENCES docs(id),
        chunk text NOT NULL,
        embedding vector(384) NOT NULL
      )
    `;

        // Create optimized HNSW index
        await sql`
      CREATE INDEX IF NOT EXISTS idx_embeddings_hnsw ON embeddings 
      USING hnsw (embedding vector_cosine_ops)
      WITH (m = 16, ef_construction = 64)
    `;

        console.log('Database setup complete');
    } catch (error) {
        console.error('Database setup failed:', error);
        throw error;
    }
}
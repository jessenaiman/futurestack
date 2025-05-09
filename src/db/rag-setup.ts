import { neon, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import { config } from 'dotenv';

// Load environment variables
config();

// Configure WebSocket support for Node.js
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
}

// Create Neon SQL client
export const sql = neon(process.env.DATABASE_URL);

// Initialize pgrag and required extensions
export async function setupPgrag() {
    console.log('Setting up required extensions...');

    try {
        await sql`CREATE EXTENSION IF NOT EXISTS vector`;
        console.log('vector extension enabled');

        await sql`CREATE EXTENSION IF NOT EXISTS rag`;
        console.log('rag extension enabled');

        await sql`CREATE EXTENSION IF NOT EXISTS rag_bge_small_en_v15`;
        console.log('rag_bge_small_en_v15 extension enabled');

        await sql`CREATE EXTENSION IF NOT EXISTS rag_jina_reranker_v1_tiny_en`;
        console.log('rag_jina_reranker_v1_tiny_en extension enabled');

        console.log('All extensions setup complete');

        // Create tables if they don't exist
        console.log('Creating docs table...');
        await sql`
            CREATE TABLE IF NOT EXISTS docs (
                id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                name TEXT NOT NULL,
                fulltext TEXT NOT NULL
            )
        `;

        console.log('Creating embeddings table...');
        await sql`
            CREATE TABLE IF NOT EXISTS embeddings (
                id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                doc_id INT NOT NULL REFERENCES docs(id),
                chunk TEXT NOT NULL,
                embedding VECTOR(384) NOT NULL
            )
        `;

        await sql`CREATE INDEX IF NOT EXISTS embeddings_vector_idx ON embeddings USING hnsw (embedding vector_cosine_ops)`;

        console.log('Database setup complete');
    } catch (error) {
        console.error('Database setup failed:', error);
        throw error;
    }
}
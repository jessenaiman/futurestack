import { sql } from './rag-setup';
import { Pool } from 'pg';

// Initialize connection pool
const pool = new Pool({
  user: 'postgres',
  password: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'vectordb'
});

// Create tables and extensions if they don't exist
async function initializeDatabase() {
  const client = await pool.connect();
  try {
    await client.query('CREATE EXTENSION IF NOT EXISTS vector');

    // Create docs table
    await client.query(`
            CREATE TABLE IF NOT EXISTS docs (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                fulltext TEXT NOT NULL
            )
        `);

    // Create embeddings table with vector support
    await client.query(`
            CREATE TABLE IF NOT EXISTS embeddings (
                id SERIAL PRIMARY KEY,
                doc_id INTEGER REFERENCES docs(id),
                chunk TEXT NOT NULL,
                embedding vector(768)
            )
        `);
  } finally {
    client.release();
  }
}

// Initialize on module load
initializeDatabase().catch(console.error);

interface QueryResult {
  name: string;
  chunk: string;
  cosine_distance: number;
}

interface OpenAIEmbeddingResponse {
  data: [{
    embedding: number[];
  }];
}

interface OpenAIChatResponse {
  choices: [{
    message: {
      content: string;
    };
  }];
}

// Function to generate embeddings using the OpenAI API
async function generateEmbedding(text: string): Promise<number[]> {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: "text-embedding-ada-002",
      input: text
    })
  });

  const data = await response.json() as OpenAIEmbeddingResponse;
  return data.data[0].embedding;
}

// Function to chunk text based on token count
function chunkText(text: string, maxTokens: number = 192): string[] {
  // Simple chunking by splitting on periods and combining until max tokens
  const sentences = text.split(/[.!?]+/);
  const chunks: string[] = [];
  let currentChunk: string[] = [];
  let currentTokens = 0;

  for (const sentence of sentences) {
    // Rough token estimate (4 chars ~ 1 token)
    const tokenEstimate = Math.ceil(sentence.length / 4);

    if (currentTokens + tokenEstimate > maxTokens && currentChunk.length > 0) {
      chunks.push(currentChunk.join('. ') + '.');
      currentChunk = [];
      currentTokens = 0;
    }

    currentChunk.push(sentence.trim());
    currentTokens += tokenEstimate;
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join('. ') + '.');
  }

  return chunks;
}

/**
 * Process a document by chunking it and generating embeddings
 */
export async function processDocument(name: string, content: string) {
  console.log(`[${name}] Starting document processing...`);

  try {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // First insert the document
      console.log(`[${name}] Inserting document...`);
      const docResult = await client.query(
        'INSERT INTO docs (name, fulltext) VALUES ($1, $2) RETURNING id',
        [name, content]
      );
      const docId = docResult.rows[0].id;
      console.log(`[${name}] Document inserted with id: ${docId}`);

      // Get chunks using token-based chunking
      console.log(`[${name}] Getting chunks...`);
      const chunks = chunkText(content);
      console.log(`[${name}] Generated ${chunks.length} chunks`);

      // Process each chunk and generate embeddings
      console.log(`[${name}] Processing chunks and generating embeddings...`);
      let processed = 0;
      for (const chunk of chunks) {
        const embedding = await generateEmbedding(chunk);
        await client.query(
          'INSERT INTO embeddings (doc_id, chunk, embedding) VALUES ($1, $2, $3)',
          [docId, chunk, embedding]
        );
        processed++;
        if (processed % 5 === 0) {
          console.log(`[${name}] Processed ${processed}/${chunks.length} chunks`);
        }
      }

      await client.query('COMMIT');
      console.log(`[${name}] Completed processing all chunks`);

      return docId;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(`[${name}] Error in processDocument:`, error);
    throw error;
  }
}

/**
 * Query documents using vector similarity search
 */
export async function queryDocuments(query: string, limit: number = 5): Promise<QueryResult[]> {
  const queryEmbedding = await generateEmbedding(query);

  const client = await pool.connect();
  try {
    const result = await client.query(`
            SELECT
                d.name,
                e.chunk,
                e.embedding <=> $1 as cosine_distance
            FROM embeddings e
            JOIN docs d ON d.id = e.doc_id
            ORDER BY cosine_distance
            LIMIT $2
        `, [queryEmbedding, limit]);

    return result.rows;
  } finally {
    client.release();
  }
}

/**
 * Get answer from ChatGPT using retrieved context
 */
export async function getAnswerWithContext(query: string, context: QueryResult[]) {
  const systemPrompt = `You are a helpful assistant. Try to answer the user's QUESTION using only the provided CONTEXT.
If the context is not relevant or complete enough to confidently answer the question, say: "I don't have enough context to answer that question."`;

  const contextText = context.map(c => c.chunk).join('\n\n');
  const userContent = '# CONTEXT\n\n' + contextText + '\n\n# QUESTION\n\n' + query;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent }
      ]
    })
  });

  const data = await response.json() as OpenAIChatResponse;
  return data.choices[0]?.message?.content;
}

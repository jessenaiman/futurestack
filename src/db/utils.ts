import { sql } from 'drizzle-orm';
import { db } from './index';
import { documents, conversations, memories } from './schema';
import { eq } from 'drizzle-orm';
import { QueryResult } from '@neondatabase/serverless';

// Type guard functions
function isChunkRow(row: unknown): row is ChunkRow {
    return typeof row === 'object' && row !== null && 'chunk' in row && typeof (row as ChunkRow).chunk === 'string';
}

function isEmbeddingRow(row: unknown): row is EmbeddingRow {
    return typeof row === 'object' && row !== null && 'embedding' in row && Array.isArray((row as EmbeddingRow).embedding);
}

function isScoreRow(row: unknown): row is ScoreRow {
    return typeof row === 'object' && row !== null && 'score' in row && typeof (row as ScoreRow).score === 'number';
}

interface ChunkRow {
    chunk: string;
}

interface EmbeddingRow {
    embedding: number[];
}

interface ScoreRow {
    score: number;
}

// Type definitions for our database entities
type Document = typeof documents.$inferSelect;
type Conversation = typeof conversations.$inferSelect;
type Memory = typeof memories.$inferSelect;

/**
 * Helper function to create a vector index with HNSW
 */
export async function createVectorIndex(tableName: string, columnName: string = 'embedding') {
    await db.execute(sql`
        CREATE INDEX IF NOT EXISTS idx_${sql.identifier(`${tableName}_${columnName}_hnsw`)}
        ON ${sql.identifier(tableName)} 
        USING hnsw (${sql.identifier(columnName)} vector_cosine_ops)
        WITH (m = 16, ef_construction = 64)
    `);
}

/**
 * Generate embeddings for text using pgrag
 */
export async function generateEmbedding(text: string, isQuery: boolean = false): Promise<number[]> {
    const result = await db.execute<QueryResult>(sql`
        SELECT ${isQuery ?
            sql`rag_bge_small_en_v15.embedding_for_query(${text})` :
            sql`rag_bge_small_en_v15.embedding_for_passage(${text})`
        } as embedding
    `);

    if (!result.rows?.[0]?.embedding) {
        throw new Error('Failed to generate embedding');
    }

    return result.rows[0].embedding as number[];
}

/**
 * Process text into chunks using pgrag
 */
export async function chunkText(text: string, maxTokens: number = 192, overlap: number = 8): Promise<string[]> {
    const result = await db.execute<QueryResult>(sql`
        SELECT unnest(rag_bge_small_en_v15.chunks_by_token_count(${text}, ${maxTokens}, ${overlap})) as chunk
    `);

    if (!Array.isArray(result.rows)) {
        throw new Error('Expected array of chunks');
    }

    return result.rows.map(row => (row as { chunk: string }).chunk);
}

/**
 * Find similar documents using vector similarity search
 */
export async function findSimilarDocuments(query: string, limit: number = 5): Promise<Array<Document & { similarity: number }>> {
    const queryEmbedding = await generateEmbedding(query, true);

    return await db.select()
        .from(documents)
        .select({
            similarity: sql<number>`1 - (embedding <=> ${sql.array(queryEmbedding)}::vector)`
        })
        .orderBy(sql`embedding <=> ${sql.array(queryEmbedding)}::vector`)
        .limit(limit);
}

/**
 * Find similar conversations using vector similarity search
 */
export async function findSimilarConversations(query: string, limit: number = 5): Promise<Array<Conversation & { similarity: number }>> {
    const queryEmbedding = await generateEmbedding(query, true);

    return await db.select()
        .from(conversations)
        .select({
            similarity: sql<number>`1 - (embedding <=> ${sql.array(queryEmbedding)}::vector)`
        })
        .orderBy(sql`embedding <=> ${sql.array(queryEmbedding)}::vector`)
        .limit(limit);
}

/**
 * Find similar memories for a user using vector similarity search
 */
export async function findSimilarMemories(userId: number, query: string, limit: number = 5): Promise<Array<Memory & { similarity: number }>> {
    const queryEmbedding = await generateEmbedding(query, true);

    return await db.select()
        .from(memories)
        .where(eq(memories.userId, userId))
        .select({
            similarity: sql<number>`1 - (embedding <=> ${sql.array(queryEmbedding)}::vector)`
        })
        .orderBy(sql`embedding <=> ${sql.array(queryEmbedding)}::vector`)
        .limit(limit);
}

/**
 * Rerank chunks against a query using pgrag's Jina reranker
 */
export async function rerankChunks(query: string, chunks: string[]): Promise<Array<{ chunk: string; score: number }>> {
    const results = await Promise.all(
        chunks.map(async (chunk) => {
            const result = await db.execute<QueryResult>(sql`
                SELECT rag_jina_reranker_v1_tiny_en.rerank_distance(${query}, ${chunk}) as score
            `);

            if (!result.rows?.[0]?.score) {
                throw new Error('Failed to get rerank score');
            }

            return {
                chunk,
                score: result.rows[0].score as number
            };
        })
    );

    return results.sort((a, b) => b.score - a.score);
}
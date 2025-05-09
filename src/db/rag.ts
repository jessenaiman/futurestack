import { sql } from './setup';

/**
 * Process a document by chunking it and generating embeddings
 */
export async function processDocument(name: string, content: string) {
    // First insert the document
    const [doc] = await sql`
    INSERT INTO docs (name, fulltext)
    VALUES (${name}, ${content})
    RETURNING id
  `;

    // Get chunks using token-based chunking
    const chunks = await sql`
    SELECT unnest(rag_bge_small_en_v15.chunks_by_token_count(${content}, 192, 8)) as chunk
  `;

    // Process each chunk and generate embeddings
    for (const { chunk } of chunks) {
        await sql`
      INSERT INTO embeddings (doc_id, chunk, embedding)
      VALUES (
        ${doc.id}, 
        ${chunk}, 
        rag_bge_small_en_v15.embedding_for_passage(${chunk})
      )
    `;
    }

    return doc.id;
}

/**
 * Query documents using vector similarity search and reranking
 */
export async function queryDocuments(query: string, limit: number = 5) {
    // First get candidates using vector similarity
    const rankedResults = await sql`
    WITH ranked AS (
      SELECT
        d.name,
        e.chunk,
        e.embedding <=> rag_bge_small_en_v15.embedding_for_query(${query}) as cosine_distance
      FROM embeddings e
      JOIN docs d ON d.id = e.doc_id
      ORDER BY cosine_distance
      LIMIT 10
    )
    SELECT 
      *,
      rag_jina_reranker_v1_tiny_en.rerank_distance(${query}, chunk) as rerank_score
    FROM ranked
    ORDER BY rerank_score DESC
    LIMIT ${limit}
  `;

    return rankedResults;
}

/**
 * Get answer from ChatGPT using retrieved context
 */
export async function getAnswerWithContext(query: string, context: Array<{ chunk: string }>) {
    const systemPrompt = `You are a helpful assistant. Try to answer the user's QUESTION using only the provided CONTEXT.
If the context is not relevant or complete enough to confidently answer the question, say: "I don't have enough context to answer that question."`;

    const contextText = context.map(c => c.chunk).join('\n\n');

    const response = await sql`
    SELECT rag.openai_chat_completion(json_build_object(
      'model', 'gpt-4',
      'messages', json_build_array(
        json_build_object(
          'role', 'system',
          'content', ${systemPrompt}
        ),
        json_build_object(
          'role', 'user',
          'content', ${'# CONTEXT\n\n' + contextText + '\n\n# QUESTION\n\n' + query}
        )
      )
    )) -> 'choices' -> 0 -> 'message' -> 'content' as answer
  `;

    return response[0]?.answer;
}
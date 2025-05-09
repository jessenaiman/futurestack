import { setupPgrag } from '../src/db/rag-setup';
import { processDocument, queryDocuments, getAnswerWithContext } from '../src/db/rag-utils';
import fs from 'fs/promises';
import path from 'path';

async function testRag() {
    try {
        // 1. Set up the database with required extensions and tables
        await setupPgrag();
        console.log('Database setup complete');

        // 2. Read and process test document
        const testDoc = await fs.readFile(path.join(__dirname, '../docs/pgrag.md'), 'utf-8');
        const docId = await processDocument('pgrag.md', testDoc);
        console.log(`Processed document with ID: ${docId}`);

        // 3. Test querying the document
        const testQuery = 'What is RAG and how does it work?';
        console.log(`\nExecuting test query: "${testQuery}"`);

        const results = await queryDocuments(testQuery);
        console.log('\nTop chunks found:');
        for (const result of results) {
            console.log(`\n--- Chunk from ${result.name} (Score: ${result.rerank_score}) ---`);
            console.log(result.chunk);
        }

        // 4. Test getting an answer with context
        console.log('\nGetting answer with context...');
        const answer = await getAnswerWithContext(testQuery, results);
        console.log('\nAnswer:', answer);

    } catch (error) {
        console.error('Test failed:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    testRag();
}
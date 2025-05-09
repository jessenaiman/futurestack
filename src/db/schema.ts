import {
    pgTable,
    serial,
    text,
    timestamp,
    jsonb,
    pgEnum,
    boolean,
    integer,
    varchar,
    customType
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// First enable the pgvector extension
export const pgvectorSetup = sql`CREATE EXTENSION IF NOT EXISTS vector`;

// Enums
export const resourceTypeEnum = pgEnum('resource_type', ['document', 'conversation', 'code', 'image']);
export const userRoleEnum = pgEnum('user_role', ['admin', 'user', 'guest']);

// Create a custom vector type using pgvector
const vector = customType<{ data: number[] }>({
    dataType() {
        return 'vector(384)'; // BGE model uses 384 dimensions
    },
});

// Documents table
export const documents = pgTable('documents', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    metadata: jsonb('metadata'),
    embedding: vector('embedding'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
});

// Conversations table
export const conversations = pgTable('conversations', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    messages: jsonb('messages').notNull(),
    metadata: jsonb('metadata'),
    embedding: vector('embedding'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
});

// Users table (referenced by memories)
export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
});

// Memories table
export const memories = pgTable('memories', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id).notNull(),
    resourceType: text('resource_type').notNull(),
    resourceId: integer('resource_id').notNull(),
    metadata: jsonb('metadata'),
    embedding: vector('embedding'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
});

// Create types for our tables
export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;

export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Memory = typeof memories.$inferSelect;
export type NewMemory = typeof memories.$inferInsert;
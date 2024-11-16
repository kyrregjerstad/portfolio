import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Simple posts table just to maintain stable IDs for comments
export const postsTable = sqliteTable('posts', {
	id: text('id').primaryKey(),
	slug: text('slug').notNull().unique(),
	createdAt: text('created_at')
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
});

// Not an optimal schema for likes, but at this scale it really doesn't matter
export const likesTable = sqliteTable('likes', {
	id: integer('id').primaryKey(),
	pageId: text('page_id').notNull(),
	userId: text('user_id').notNull(),
	location: text('country'),
	timestamp: text('timestamp')
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
});

export const commentsTable = sqliteTable('comments', {
	id: integer('id').primaryKey(),
	postId: text('post_id')
		.notNull()
		.references(() => postsTable.id),
	author: text('author').notNull(),
	content: text('content').notNull(),
	timestamp: text('timestamp')
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
});

export type InsertPost = typeof postsTable.$inferInsert;
export type SelectPost = typeof postsTable.$inferSelect;
export type InsertLike = typeof likesTable.$inferInsert;
export type SelectLike = typeof likesTable.$inferSelect;
export type InsertComment = typeof commentsTable.$inferInsert;
export type SelectComment = typeof commentsTable.$inferSelect;

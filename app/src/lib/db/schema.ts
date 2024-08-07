import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

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

export type InsertLike = typeof likesTable.$inferInsert;
export type SelectLike = typeof likesTable.$inferSelect;

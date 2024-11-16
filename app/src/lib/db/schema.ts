import { relations, sql, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const userTable = sqliteTable('user', {
	id: integer('id').primaryKey(),
	githubId: integer('github_id').notNull(),
	username: text('username').notNull(),
});

export const userRelations = relations(userTable, ({ many }) => ({
	comments: many(commentsTable),
}));

export const sessionTable = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => userTable.id),
	expiresAt: integer('expires_at', {
		mode: 'timestamp',
	}).notNull(),
});

export const sessionRelations = relations(sessionTable, ({ one }) => ({
	user: one(userTable, {
		fields: [sessionTable.userId],
		references: [userTable.id],
	}),
}));

export const postsTable = sqliteTable('posts', {
	id: text('id').primaryKey(),
	slug: text('slug').notNull().unique(),
	createdAt: text('created_at')
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
});

export const postsRelations = relations(postsTable, ({ many }) => ({
	comments: many(commentsTable),
}));

export const commentsTable = sqliteTable('comments', {
	id: integer('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => userTable.id),
	postId: text('post_id')
		.notNull()
		.references(() => postsTable.id),
	displayName: text('display_name').notNull(),
	content: text('content').notNull(),
	timestamp: text('timestamp')
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
});

export const commentsRelations = relations(commentsTable, ({ one }) => ({
	user: one(userTable, {
		fields: [commentsTable.userId],
		references: [userTable.id],
	}),
	post: one(postsTable, {
		fields: [commentsTable.postId],
		references: [postsTable.id],
	}),
}));

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

export type SelectPost = InferSelectModel<typeof postsTable>;
export type SelectLike = InferSelectModel<typeof likesTable>;
export type SelectComment = InferSelectModel<typeof commentsTable>;
export type User = InferSelectModel<typeof userTable>;
export type Session = InferSelectModel<typeof sessionTable>;

export type InsertPost = InferInsertModel<typeof postsTable>;
export type InsertLike = InferInsertModel<typeof likesTable>;
export type InsertComment = InferInsertModel<typeof commentsTable>;

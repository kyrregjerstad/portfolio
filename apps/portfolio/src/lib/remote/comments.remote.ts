import { form, getRequestEvent, query } from '$app/server';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/lib/db/db';
import { commentsTable } from '@/lib/db/schema';
import { getPost } from '@/lib/getPost';
import { moderateContent } from '@/lib/server/moderation';

const commentFormSchema = z.object({
	displayName: z
		.string()
		.min(1, 'Display Name is required')
		.max(50, 'Display Name must be less than 50 characters'),
	content: z
		.string()
		.min(2, 'Comment is required')
		.max(2000, 'Comment must be less than 2000 characters'),
	botCheck: z.boolean().optional(),
});

export const getComments = query(z.string(), async (slug) => {
	const post = await getPost(slug);
	if (!post) return [];

	return db.query.commentsTable.findMany({
		where: eq(commentsTable.postId, post.metadata.id),
	});
});

export const submitComment = form(commentFormSchema, async (data) => {
	const { locals, params } = getRequestEvent();

	if (!locals.user) error(401, 'You must be logged in to submit a comment.');
	if (data.botCheck) return { ok: false as const, message: 'Are you a robot?' };

	const slug = params.slug;
	if (!slug) error(400, 'Missing slug');

	const post = await getPost(slug);
	if (!post) error(404, 'Post not found');

	const moderation = await moderateContent(
		`displayName: ${data.displayName}\ncontent: ${data.content}`,
	);

	if (moderation.suggestedAction === 'REJECT') {
		return { ok: false as const, message: 'Your comment was rejected' };
	}
	if (moderation.suggestedAction === 'REVIEW') {
		return { ok: false as const, message: 'Your comment was flagged for review' };
	}

	await db.insert(commentsTable).values({
		displayName: data.displayName,
		content: data.content,
		postId: post.metadata.id,
		userId: locals.user.id,
	});

	void getComments(slug).refresh();

	return { ok: true as const, message: 'Comment submitted successfully' };
});

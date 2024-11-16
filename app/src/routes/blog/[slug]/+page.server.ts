import { db } from '@/lib/db/db';
import type { PageServerLoad } from './$types';
import { commentsTable, postsTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { commentFormSchema } from '@/lib/schema/CommentForm';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { error } from '@sveltejs/kit';
import { getPost } from '@/posts/getPost';

export const load = (async ({ params }) => {
	const post = await getPost(params.slug);

	if (!post) {
		throw error(404, `Could not find ${params.slug}`);
	}

	const comments = await db.query.commentsTable.findMany({
		where: eq(commentsTable.postId, post.metadata.id),
	});

	const commentForm = await superValidate(zod(commentFormSchema));

	return {
		comments,
		commentForm,
	};
}) satisfies PageServerLoad;

export const actions = {
	submitComment: async ({ request, params }) => {
		const form = await superValidate(request, zod(commentFormSchema));

		if (!form.valid) {
			return fail(400, { commentForm: form });
		}

		// Get the post ID
		const post = await db.query.postsTable.findFirst({
			where: eq(postsTable.slug, params.slug),
		});

		if (!post) {
			return fail(404, { commentForm: form });
		}

		const { author, content } = form.data;

		await db.insert(commentsTable).values({
			author,
			content,
			postId: post.id,
		});

		return message(form, 'Comment submitted successfully');
	},
};

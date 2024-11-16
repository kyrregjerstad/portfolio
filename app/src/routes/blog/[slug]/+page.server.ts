import { db } from '@/lib/db/db';
import type { PageServerLoad } from './$types';
import { commentsTable, postsTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { commentFormSchema } from '@/lib/schema/CommentForm';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { error } from '@sveltejs/kit';
import { getPost } from '@/lib/getPost';

export const load = (async ({ params, locals }) => {
	const post = await getPost(params.slug);

	if (!post) {
		throw error(404, `Could not find ${params.slug}`);
	}

	const dbPost = await db.query.postsTable.findFirst({
		where: eq(postsTable.id, post.metadata.id),
	});

	// If the post doesn't exist in the database, insert it
	if (!dbPost) {
		await db.insert(postsTable).values(post.metadata);
	}

	const comments = await db.query.commentsTable.findMany({
		where: eq(commentsTable.postId, post.metadata.id),
	});

	const commentForm = await superValidate(zod(commentFormSchema));

	return {
		comments,
		commentForm,
		isLoggedIn: !!locals.user,
	};
}) satisfies PageServerLoad;

export const actions = {
	submitComment: async ({ request, params, locals }) => {
		const form = await superValidate(request, zod(commentFormSchema));

		console.log('locals', locals);

		if (!locals.user) {
			return fail(401, { commentForm: form });
		}
		if (!form.valid) {
			return fail(400, { commentForm: form });
		}

		if (form.data.botCheck) {
			// 🤖 honeypot 🤖
			return message(form, 'Are you a robot?');
		}

		const post = await getPost(params.slug);

		if (!post) {
			return fail(404, { commentForm: form });
		}

		const { displayName, content } = form.data;

		await db.insert(commentsTable).values({
			displayName,
			content,
			postId: post.metadata.id,
			userId: locals.user.id,
		});

		return message(form, 'Comment submitted successfully');
	},
};

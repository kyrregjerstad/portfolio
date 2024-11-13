import { db } from '@/lib/db/db';
import type { PageServerLoad } from './$types';
import { commentsTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { commentFormSchema } from '@/lib/schema/CommentForm';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = (async ({ params }) => {
	const comments = await db.query.commentsTable.findMany({
		where: eq(commentsTable.postSlug, params.slug),
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

		console.log(form);

		if (!form.valid) {
			return fail(400, { commentForm: form });
		}

		const { author, content } = form.data;

		await db.insert(commentsTable).values({ author, content, postSlug: params.slug });

		return message(form, 'Comment submitted successfully');
	},
};

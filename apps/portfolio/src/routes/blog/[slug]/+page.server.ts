import { db } from '@/lib/db/db';
import type { EntryGenerator, PageServerLoad } from './$types';
import { commentsTable, postsTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { commentFormSchema } from '@/lib/schema/CommentForm';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { error } from '@sveltejs/kit';
import { getAllPosts, getPost } from '@/lib/getPost';
import { moderateContent } from '@/lib/server/moderation';
import { runQuery } from '@/lib/services/sanity';

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

	const commentForm = await superValidate(zod(commentFormSchema));

	return {
		commentForm,
		isLoggedIn: !!locals.user,
	};
}) satisfies PageServerLoad;

// export const actions = {
// 	submitComment: async ({ request, params, locals }) => {
// 		const commentForm = await superValidate(request, zod(commentFormSchema));

// 		if (!locals.user) {
// 			return fail(401, { commentForm });
// 		}

// 		if (!commentForm.valid) {
// 			return fail(400, { commentForm });
// 		}

// 		if (commentForm.data.botCheck) {
// 			// 🤖 honeypot 🤖
// 			return message(commentForm, 'Are you a robot?');
// 		}

// 		const post = await getPost(params.slug);

// 		if (!post) {
// 			return fail(404, { commentForm });
// 		}

// 		const { displayName, content } = commentForm.data;

// 		const moderationResult = await moderateContent(`displayName: ${displayName}\ncontent: ${content}`);

// 		if (moderationResult.suggestedAction === 'REJECT') {
// 			return message(commentForm, 'Your comment was rejected');
// 		} else if (moderationResult.suggestedAction === 'REVIEW') {
// 			return message(commentForm, 'Your comment was flagged for review');
// 		} else {
// 			await db.insert(commentsTable).values({
// 				displayName,
// 				content,
// 				postId: post.metadata.id,
// 				userId: locals.user.id,
// 			});
// 		}

// 		return message(commentForm, 'Comment submitted successfully');
// 	},
// };

export const entries: EntryGenerator = async () => {
	const posts = await getAllPosts();
	return posts.map((post) => ({ slug: post.metadata.slug }));
};

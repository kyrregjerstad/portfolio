import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch, data }) => {
	try {
		const post = await import(`../../../posts/${params.slug}.md`);
		const comments = data.comments.map((comment) => ({
			...comment,
			createdAt: new Date(comment.timestamp),
		}));

		return {
			commentForm: data.commentForm,
			comments,
			content: post.default,
			meta: post.metadata,
		};
	} catch (e) {
		console.error(e);
		throw error(404, `Could not find ${params.slug}`);
	}
};

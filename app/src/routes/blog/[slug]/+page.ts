import { getPost } from '@/posts/getPost';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, data }) => {
	try {
		const post = await getPost(params.slug);

		if (!post) {
			throw error(404, `Could not find ${params.slug}`);
		}

		// transform the comments to include a createdAt date
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

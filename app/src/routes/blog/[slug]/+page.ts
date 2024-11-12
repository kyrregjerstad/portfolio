import type { Post } from '@/lib/types';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params, fetch }) => {
	try {
		const post = await import(`../../../posts/${params.slug}.md`);

		console.log('post', post);
		return {
			content: post.default,
			meta: post.metadata,
		};
	} catch (e) {
		console.error(e);
		throw error(404, `Could not find ${params.slug}`);
	}
};

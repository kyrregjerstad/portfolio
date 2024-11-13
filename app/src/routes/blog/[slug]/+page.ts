import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

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

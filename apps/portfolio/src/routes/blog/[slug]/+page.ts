import { getPost } from '@/lib/getPost';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, data }) => {
	try {
		const post = await getPost(params.slug);

		if (!post) {
			throw error(404, `Could not find ${params.slug}`);
		}

		return {
			isLoggedIn: data.isLoggedIn,
			commentForm: data.commentForm,
			content: post.default,
			meta: post.metadata,
			socials: {
				siteName: 'Kyrre Gjerstad | Blog',
				title: `${post.metadata.title} | Kyrre Gjerstad`,
				description: post.metadata.description,
				image: 'https://kyrre.dev/images/og-kyrre-gjerstad-blog.jpg',
			},
		};
	} catch (e) {
		console.error(e);
		throw error(404, `Could not find ${params.slug}`);
	}
};

export const ssr = true;
export const prerender = true;

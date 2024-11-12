import type { RequestHandler } from './$types';

import type { Post } from '$lib/types';

async function getPosts(): Promise<Post[]> {
	const posts: Post[] = [];
	const paths = import.meta.glob('/src/posts/*.md', { eager: true });

	for (const path in paths) {
		const file = paths[path];
		const slug = path.split('/').pop()?.replace('.md', '');
		console.log(slug);

		if (file && slug && typeof file === 'object' && 'metadata' in file) {
			const metadata = file.metadata as Omit<Post, 'slug'>;
			const post = { ...metadata, slug } satisfies Post;
			post.published && posts.push(post);
		}
	}

	return posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export const GET: RequestHandler = async () => {
	const posts = await getPosts();
	return new Response(JSON.stringify(posts));
};

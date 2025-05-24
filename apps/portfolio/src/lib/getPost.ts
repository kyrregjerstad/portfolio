import { z } from 'zod';

const postSchema = z.object({
	metadata: z.object({
		id: z.string().uuid(),
		title: z.string().min(1),
		slug: z.string().min(1),
		layout: z.string().default('blog'),
		published: z.boolean().default(false),
		publishedAt: z.string(),
		categories: z.array(z.string()).default([]),
		author: z.string().default('Kyrre Gjerstad'),
		description: z.string().optional(),
		seoTitle: z.string().optional(),
		seoDescription: z.string().optional(),
		seoKeywords: z.array(z.string()).default([]),
		ogImage: z.string().optional(),
	}),
	default: z.any(),
});

export async function getPost(slug: string) {
	try {
		const md = await import(`../posts/${slug}.md`);
		const post = postSchema.safeParse(md);

		if (!post.success) {
			return null;
		}

		if (!post.data.metadata.published) {
			return null;
		}

		return post.data;
	} catch (e) {
		console.error(e);
		return null;
	}
}

export async function getAllPosts() {
	const posts = await import.meta.glob('../posts/*.md', { eager: true });
	const postSchemas = Object.values(posts).map((post) => postSchema.safeParse(post));

	return postSchemas.filter((post) => post.success).map((post) => post.data);
}

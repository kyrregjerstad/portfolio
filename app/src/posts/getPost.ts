import { z } from 'zod';

const postSchema = z.object({
	metadata: z.object({
		id: z.string().uuid(),
		title: z.string().min(1),
		slug: z.string().min(1),
		published: z.boolean().default(false),
		publishedAt: z.string(),
		categories: z.array(z.string()).default([]),
		author: z.string().default('Kyrre Gjerstad'),
	}),
	default: z.any(),
});

export async function getPost(slug: string) {
	try {
		const md = await import(`./${slug}.md`);
		const post = postSchema.safeParse(md);

		if (!post.success) {
			return null;
		}

		if (!post.data.metadata.published) {
			return null;
		}

		return post.data;
	} catch (e) {
		return null;
	}
}

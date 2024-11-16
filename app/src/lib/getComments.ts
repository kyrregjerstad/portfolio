import { z } from 'zod';

const schema = z.array(
	z.object({
		id: z.number(),
		displayName: z.string(),
		content: z.string(),
		timestamp: z.string(),
	})
);

export async function fetchComments(postId: string) {
	try {
		const res = await fetch(`/api/posts/${postId}/comments`);
		const data = await res.json();
		return schema.parse(data);
	} catch (error) {
		console.error(error);
		return [];
	}
}

export type FetchComments = Awaited<ReturnType<typeof fetchComments>>;

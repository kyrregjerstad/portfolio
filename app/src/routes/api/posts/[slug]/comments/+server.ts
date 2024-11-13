import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// In a real application, you would use a database
let comments: Record<string, Array<{ id: string; author: string; content: string; createdAt: Date }>> = {};

export const GET: RequestHandler = async ({ params }) => {
	const postComments = comments[params.slug] || [];
	return json(postComments);
};

export const POST: RequestHandler = async ({ params, request }) => {
	const { author, content } = await request.json();

	if (!comments[params.slug]) {
		comments[params.slug] = [];
	}

	const newComment = {
		id: crypto.randomUUID(),
		author,
		content,
		createdAt: new Date(),
	};

	comments[params.slug].push(newComment);

	return json(newComment);
};

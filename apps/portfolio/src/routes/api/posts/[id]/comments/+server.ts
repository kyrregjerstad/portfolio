import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '@/lib/db/db';
import { commentsTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ params }) => {
	const comments = await db.query.commentsTable.findMany({
		where: eq(commentsTable.postId, params.id),
	});

	return json(comments);
};

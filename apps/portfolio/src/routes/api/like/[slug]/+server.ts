import { db } from '@/lib/db/db.js';
import { likesTable } from '@/lib/db/schema.js';
import { and, eq, sql } from 'drizzle-orm';

import type { RequestHandler } from './$types';
import { MAX_LIKES_PER_USER } from '@/lib/config';

export const PUT: RequestHandler = async (event) => {
	const slug = event.params.slug;
	const clientAddress = event.getClientAddress();

	const res = await likePage(slug, clientAddress);

	console.log('success', res);

	if (res.success) {
		return new Response(JSON.stringify(res), {
			status: 200,
		});
	}

	return new Response(JSON.stringify(res), {
		status: 400,
	});
};

async function getPageLikes(slug: string) {
	try {
		const likes = await db
			.select({
				count: sql<number>`COUNT(*)`.as('count'),
			})
			.from(likesTable)
			.where(eq(likesTable.pageId, slug))
			.limit(1);

		return likes[0].count;
	} catch (error) {
		console.error(error);
		return 0;
	}
}

async function likePage(slug: string, userId: string) {
	const previousLikes = await getPreviousLikesByUser(slug, userId);
	const likeCount = await getPageLikes(slug);

	if (previousLikes >= MAX_LIKES_PER_USER) {
		return {
			success: false,
			message: 'Thank you for your support! But you have already liked this page 13 times ;)',
			likeCount,
		};
	}
	try {
		await db.insert(likesTable).values({
			pageId: slug,
			userId,
		});
	} catch (error) {
		console.error(error);
		return {
			success: false,
			message: 'An error occurred while trying to like this page. Please try again later.',
			likeCount,
		};
	}

	return {
		success: true,
		message: 'Thank you for your support!',
		likeCount: likeCount + 1,
	};
}

async function getPreviousLikesByUser(slug: string, userId: string) {
	const likesByUser = await db.query.likesTable.findMany({
		where: and(eq(likesTable.pageId, slug), eq(likesTable.userId, userId)),
	});

	return likesByUser.length;
}

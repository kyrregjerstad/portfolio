import { and, eq, sql } from 'drizzle-orm';
import { db } from '../db';
import { likesTable } from '../schema';
import { MAX_LIKES_PER_USER } from '@/lib/config';

export async function getTotalLikes() {
	try {
		const [likes] = await db
			.select({
				count: sql<number>`COUNT(*)`.as('count'),
			})
			.from(likesTable)
			.limit(1);

		return likes.count;
	} catch (error) {
		console.error(error);
		return 0;
	}
}

export async function getTotalLikesByPage(pageId: string) {
	try {
		const [likes] = await db
			.select({
				count: sql<number>`COUNT(*)`.as('count'),
			})
			.from(likesTable)
			.where(eq(likesTable.pageId, pageId))
			.limit(1);

		return likes.count;
	} catch (error) {
		console.error(error);
		return 0;
	}
}

export async function getTotalLikesByUser(userId: string, pageId: string) {
	try {
		const [likes] = await db
			.select({
				count: sql<number>`COUNT(*)`.as('count'),
			})
			.from(likesTable)
			.where(and(eq(likesTable.userId, userId), eq(likesTable.pageId, pageId)))
			.limit(1);

		return likes.count;
	} catch (error) {
		console.error(error);
		return 0;
	}
}

export async function likePage(slug: string, userId: string) {
	const previousLikes = await getTotalLikesByUser(userId, slug);
	const likeCount = await getTotalLikesByPage(slug);

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

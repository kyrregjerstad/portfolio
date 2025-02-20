import { getTotalLikes, getTotalLikesByUser } from '@/lib/db/methods';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async (event) => {
	const userId = event.getClientAddress();

	try {
		const [totalLikes, totalLikesByUser] = await Promise.all([getTotalLikes(), getTotalLikesByUser(userId, 'hero')]);

		return json({
			likes: totalLikes,
			totalLikesByUser,
		});
	} catch (error) {
		console.error(error);
		return json({
			likes: 0,
			totalLikesByUser: 0,
		});
	}
};

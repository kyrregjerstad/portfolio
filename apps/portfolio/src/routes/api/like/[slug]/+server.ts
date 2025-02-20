import { getTotalLikesByPage, getTotalLikesByUser, likePage } from '@/lib/db/methods';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async (event) => {
	const slug = event.params.slug;
	const clientAddress = event.getClientAddress();

	const res = await likePage(slug, clientAddress);

	if (res.success) {
		return json(res);
	}

	return error(400, {
		message: res.message,
	});
};

export const GET: RequestHandler = async (event) => {
	const slug = event.params.slug;
	const clientAddress = event.getClientAddress();
	const [likes, totalLikesByUser] = await Promise.all([
		getTotalLikesByPage(slug),
		getTotalLikesByUser(clientAddress, slug),
	]);

	return json({
		likes,
		totalLikesByUser,
	});
};

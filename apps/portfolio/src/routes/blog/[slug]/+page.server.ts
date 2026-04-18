import { db } from '@/lib/db/db';
import type { EntryGenerator, PageServerLoad } from './$types';
import { postsTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { getAllPosts, getPost } from '@/lib/getPost';

export const load = (async ({ params, locals }) => {
	const post = await getPost(params.slug);

	if (!post) {
		throw error(404, `Could not find ${params.slug}`);
	}

	const dbPost = await db.query.postsTable.findFirst({
		where: eq(postsTable.id, post.metadata.id),
	});

	if (!dbPost) {
		await db.insert(postsTable).values(post.metadata);
	}

	return {
		isLoggedIn: !!locals.user,
	};
}) satisfies PageServerLoad;

export const entries: EntryGenerator = async () => {
	const posts = await getAllPosts();
	return posts.map((post) => ({ slug: post.metadata.slug }));
};

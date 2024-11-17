import { db } from '@/lib/db/db.js';
import { likesTable } from '@/lib/db/schema.js';
import { runQuery } from '@/lib/services/sanity';
import type { Actions } from '@sveltejs/kit';
import { and, eq, sql } from 'drizzle-orm';

import { q, sanityImage } from 'groqd';

export const load = async ({ params }) => {
	const { slug } = params;

	// TODO: refactor to be parallel
	const project = await runQuery(
		q('*')
			.filterByType('project')
			.filter(`slug.current == '${slug}'`)
			.slice(0)
			.grab({
				title: q.string(),
				description: q.string().nullable(),
				richDescription: q.array(q.contentBlock()).nullable(),
				href: q.string(),
				linkTitle: q.string(),
				gitHubLink: q.string().nullable(),
				client: q.string().nullable(),
				keyFeatures: q.array(q.string()).nullable(),
				images: sanityImage('images', { isList: true, withAsset: ['blurHash', 'base'] }).nullable(),
				type: q.union([q.literal('academic'), q.literal('professional'), q.literal('personal')]),
				technologies: q('technologies').filter().deref().grab({
					title: q.string(),
				}),
			})
	);

	const allProjects = await runQuery(
		q('*')
			.filterByType('page')
			.filter("title == 'Home'")
			.slice(0)
			.grab({
				projects: q('projects')
					.filter()
					.deref()
					.grab({
						title: q.string(),
						slug: q.slug('slug'),
					}),
			})
	);

	const projectIndex = allProjects.projects.findIndex((p) => p.slug === slug);
	const nextProject = allProjects.projects[projectIndex + 1];
	const prevProject = allProjects.projects[projectIndex - 1];

	return {
		project,
		nextProject,
		prevProject,
		likes: await getPageLikes(slug),
	};
};

export const actions: Actions = {
	default: async (event) => {
		const slug = event.params.slug || 'unknown';
		const clientAddress = event.getClientAddress() || 'unknown';

		const success = await likePage(slug, clientAddress);

		return success;
	},
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

	if (previousLikes >= 3) {
		return {
			success: false,
			message: 'Thank you for your support! But you have already liked this page 3 times ;)',
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

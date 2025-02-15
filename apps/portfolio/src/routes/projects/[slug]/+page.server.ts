import { db } from '@/lib/db/db.js';
import { likesTable } from '@/lib/db/schema.js';
import { runQuery } from '@/lib/services/sanity';
import type { Actions } from '@sveltejs/kit';
import { and, eq, sql } from 'drizzle-orm';

import { q, sanityImage } from 'groqd';

export const load = async ({ params, getClientAddress }) => {
	const { slug } = params;

	// TODO: refactor to be parallel
	// const project = await runQuery(
	// 	q('*')
	// 		.filterByType('project')
	// 		.filter(`slug.current == '${slug}'`)
	// 		.slice(0)
	// 		.grab({
	// 			title: q.string(),
	// 			description: q.string().nullable(),
	// 			richDescription: q.array(q.contentBlock()).nullable(),
	// 			href: q.string(),
	// 			linkTitle: q.string(),
	// 			gitHubLink: q.string().nullable(),
	// 			client: q.string().nullable(),
	// 			keyFeatures: q.array(q.string()).nullable(),
	// 			images: sanityImage('images', { isList: true, withAsset: ['blurHash', 'base'] }).nullable(),
	// 			type: q.union([q.literal('academic'), q.literal('professional'), q.literal('personal')]),
	// 			technologies: q('technologies').filter().deref().grab({
	// 				title: q.string(),
	// 			}),
	// 		})
	// );

	// const allProjects = await runQuery(
	// 	q('*')
	// 		.filterByType('page')
	// 		.filter("title == 'Home'")
	// 		.slice(0)
	// 		.grab({
	// 			projects: q('projects')
	// 				.filter()
	// 				.deref()
	// 				.grab({
	// 					title: q.string(),
	// 					slug: q.slug('slug'),
	// 				}),
	// 		})
	// );

	const [project, allProjects] = await Promise.all([
		runQuery(
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
		),
		runQuery(
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
		),
	]);

	const projectIndex = allProjects.projects.findIndex((p) => p.slug === slug);
	const nextProject = allProjects.projects[projectIndex + 1];
	const prevProject = allProjects.projects[projectIndex - 1];

	return {
		project,
		nextProject,
		prevProject,
	};
};

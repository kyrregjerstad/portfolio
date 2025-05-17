import { getTotalLikesByPage } from '@/lib/db/methods';
import { allProjectsQuery, homePageQuery, projectQuery } from '@/lib/server/queries';
import { runQuery } from '@/lib/services/sanity';
import type { EntryGenerator } from './$types';

export const load = async ({ params }) => {
	const { slug } = params;

	const [project, allProjects] = await Promise.all([
		runQuery(projectQuery, {
			parameters: {
				slug,
			},
		}),
		runQuery(homePageQuery),
	]);

	if (!project || !allProjects) {
		throw new Error('Project or home page not found');
	}

	const projectIndex = allProjects?.findIndex((p) => p.slug === slug) ?? 0;
	const nextProject = allProjects?.[projectIndex + 1] ?? null;
	const prevProject = allProjects?.[projectIndex - 1] ?? null;

	return {
		project,
		nextProject,
		prevProject,
		slug,
		likes: await getTotalLikesByPage(slug),
	};
};

export const entries: EntryGenerator = async () => {
	const allProjects = await runQuery(allProjectsQuery);
	const slugs = allProjects.projects.map((p) => p.slug).filter((p) => p !== null);

	return slugs.map((slug) => ({ slug }));
};

export const prerender = true;
export const ssr = true;

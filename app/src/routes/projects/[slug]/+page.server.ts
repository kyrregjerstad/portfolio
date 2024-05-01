import { runQuery } from '@/lib/services/sanity';
import { q, sanityImage } from 'groqd';

export const load = async ({ params }) => {
	const { slug } = params;

	return {
		project: await runQuery(
			q('*')
				.filterByType('project')
				.filter(`slug.current == '${slug}'`)
				.slice(0)
				.grab({
					title: q.string(),
					description: q.string(),
					href: q.string(),
					linkTitle: q.string(),
					gitHubLink: q.string().nullable(),
					keyFeatures: q.array(q.string()).nullable(),
					images: sanityImage('images', { isList: true, withAsset: ['base'] }).nullable(),
				})
		),
	};
};

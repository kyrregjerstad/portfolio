import { runQuery } from '@/lib/services/sanity';
import { q } from 'groqd';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		page: await runQuery(
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
							description: q.string().nullable(),
							slug: q.slug('slug'),
						}),
					title: q.string(),
					heading: q.string(),
					description: q.string(),
				})
		),
	};
};

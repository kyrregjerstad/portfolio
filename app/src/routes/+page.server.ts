import { runQuery } from '@/lib/services/sanity';
import { q } from 'groqd';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		projects: await runQuery(
			q('*', { isArray: true })
				.filterByType('project')
				.grab({
					title: q.string(),
					slug: q.slug('slug'),
				})
		),
	};
};

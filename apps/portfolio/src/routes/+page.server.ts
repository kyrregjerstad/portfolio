import { contactSchema } from '@/lib/schema/contactSchema';
import { runQuery } from '@/lib/services/sanity';
import { q } from 'groqd';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, locals }) => {
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
							slug: q.slug('slug'),
						}),
					title: q.string(),
					heading: q.string(),
					description: q.array(q.contentBlock()),
				})
		),
		contactForm: await superValidate(zod(contactSchema)),
		darkMode: cookies.get('theme') === 'dark',
		firstVisit: locals.firstVisit,
	};
};

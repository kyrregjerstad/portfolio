import { contactSchema } from '@/lib/schema/contactSchema';
import { runQuery } from '@/lib/services/sanity';
import { createGroqBuilder } from 'groqd';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { getTotalLikes } from '@/lib/db/methods';
import type * as SanityTypes from '@/lib/services/sanity.types';

const q = createGroqBuilder<{
	schemaTypes: SanityTypes.AllSanitySchemaTypes;
	referenceSymbol: typeof SanityTypes.internalGroqTypeReferenceTo;
}>();

const homePageQuery = q.star
	.filterByType('page')
	.filterBy(`title == "Home"`)
	.slice(0)
	.project((sub) => ({
		title: true,
		heading: true,
		description: true,
		projects: sub.field('projects[]').deref().project({
			title: true,
			slug: 'slug.current',
		}),
	}));

export const load: PageServerLoad = async ({ cookies, locals }) => {
	return {
		page: await runQuery(homePageQuery),
		contactForm: await superValidate(zod(contactSchema)),
		darkMode: cookies.get('theme') === 'dark',
		totalLikes: await getTotalLikes(),
		firstVisit: locals.firstVisit,
	};
};

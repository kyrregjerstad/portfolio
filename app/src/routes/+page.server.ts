import { runQuery } from '@/lib/services/sanity';
import { q } from 'groqd';
import type { PageServerLoad } from './$types';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { contactSchema } from '@/lib/schema/contactSchema';

export const load: PageServerLoad = async ({ cookies }) => {
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
		contactForm: await superValidate(zod(contactSchema)),
		darkMode: cookies.get('theme') === 'dark',
	};
};

export const actions = {
	submitContactForm: async ({ request, fetch }) => {
		const form = await superValidate(request, zod(contactSchema));

		console.log(form);
		if (!form.valid) {
			return fail(400, { form });
		}

		// honeypot field, should be invisible to users
		if (form.data.botCheck) {
			return message(form, 'Will this trick the bots?');
		}

		const res = await fetch('/api/email', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(form.data),
		});

		if (!res.ok) {
			console.log('res.status', res.status);
			return fail(res.status, { form });
		}

		return message(form, 'Form posted successfully!');
	},

	setTheme: async ({ cookies, request }) => {
		const data = await request.formData();
		const theme = data.get('dark-mode') ? 'dark' : 'light';

		cookies.set('theme', theme, {
			path: '/',
			maxAge: 60 * 60 * 24 * 365, // 1 year
		});
	},
};

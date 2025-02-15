import { contactSchema } from '@/lib/schema/contactSchema';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

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
		const theme = data.get('dark-mode') === 'dark' ? 'dark' : 'light';

		cookies.set('theme', theme, {
			path: '/',
			maxAge: 60 * 60 * 24 * 365, // 1 year
		});
	},
};

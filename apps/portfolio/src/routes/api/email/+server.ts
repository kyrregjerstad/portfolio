import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ENV } from 'varlock/env';
import { Resend } from 'resend';
import { contactSchema } from '$lib/schema/contactSchema';

const resend = new Resend(ENV.RESEND_API_KEY);

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const { name, email, subject, message } = contactSchema.parse(body);

		await resend.emails.send({
			to: 'kyrregjerstad@gmail.com',
			from: 'hi@kyrre.dev',
			subject: subject,
			text: message,
			html: `<p>new message from ${name}, email: ${email}</p> <p>${message}</p>`,
		});

		return json({ success: true });
	} catch (e) {
		console.log(e);
		if (e instanceof Error) {
			return error(500, e.message);
		}
		return error(500, 'An error occurred');
	}
};

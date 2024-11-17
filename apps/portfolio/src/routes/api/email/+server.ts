import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PRIVATE_SENDGRID_API_KEY } from '$env/static/private';
import sgMail from '@sendgrid/mail';
import { contactSchema } from '$lib/schema/contactSchema';

sgMail.setApiKey(PRIVATE_SENDGRID_API_KEY);

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const { name, email, subject, message } = contactSchema.parse(body);

		const msg = {
			to: 'kyrregjerstad@gmail.com',
			from: 'hi@kyrre.dev',
			subject: subject,
			text: message,
			html: `<p>new message from ${name}, email: ${email}</p> <p>${message}</p>`,
		};

		await sgMail.send(msg);
		return json({ success: true });
	} catch (e) {
		console.log(e);
		if (e instanceof Error) {
			return error(500, e.message);
		}
		return error(500, 'An error occurred');
	}
};

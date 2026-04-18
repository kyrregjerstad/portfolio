import { form } from '$app/server';
import { error } from '@sveltejs/kit';
import { Resend } from 'resend';
import { ENV } from 'varlock/env';
import { z } from 'zod';

const contactFormSchema = z.object({
	name: z
		.string()
		.min(3, 'Name must be over 3 characters')
		.max(50, 'Name must be under 50 characters'),
	subject: z
		.string()
		.min(3, 'Subject must be over 3 characters')
		.max(50, 'Subject must be under 50 characters'),
	email: z.string().email('Invalid email address'),
	message: z
		.string()
		.min(10, 'Message must be over 10 characters')
		.max(500, 'Message must be under 500 characters'),
	botCheck: z.boolean().optional(),
});

const resend = new Resend(ENV.RESEND_API_KEY);

export const submitContactForm = form(contactFormSchema, async (data) => {
	if (data.botCheck) {
		return { success: true };
	}

	const { name, email, subject, message } = data;

	try {
		await resend.emails.send({
			to: 'kyrregjerstad@gmail.com',
			from: 'hi@kyrre.dev',
			subject,
			text: message,
			html: `<p>new message from ${name}, email: ${email}</p> <p>${message}</p>`,
		});
	} catch (e) {
		console.error(e);
		error(500, 'Failed to send message');
	}

	return { success: true };
});

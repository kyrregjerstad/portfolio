import { form } from '$app/server';
import { error } from '@sveltejs/kit';
import { z } from 'zod';
import { sendEmail } from '$lib/server/email';

const contactFormSchema = z.object({
	name: z
		.string()
		.min(3, 'Name must be over 3 characters')
		.max(50, 'Name must be under 50 characters'),
	subject: z
		.string()
		.min(3, 'Subject must be over 3 characters')
		.max(50, 'Subject must be under 50 characters'),
	email: z.email('Invalid email address'),
	message: z
		.string()
		.min(10, 'Message must be over 10 characters')
		.max(500, 'Message must be under 500 characters'),
	botCheck: z.boolean().optional(),
});

export const submitContactForm = form(contactFormSchema, async (data) => {
	if (data.botCheck) {
		return { success: true };
	}

	const { name, email, subject, message } = data;

	const { error: sendError } = await sendEmail({
		to: 'kyrregjerstad@gmail.com',
		from: { address: 'hi@mail.kyrre.dev', name: 'Kyrre' },
		replyTo: email,
		subject,
		text: `From: ${name} <${email}>\n\n${message}`,
	});

	if (sendError) {
		console.error('CF email send failed', sendError);
		error(500, 'Failed to send message');
	}

	return { success: true };
});

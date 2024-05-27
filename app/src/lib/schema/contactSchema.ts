import { z } from 'zod';

export const contactSchema = z.object({
	name: z.string().min(3, 'Name must be over 3 characters').max(50, 'Name must be under 50 characters').nullish(),
	subject: z.string().min(3, 'Subject must be over 3 characters').max(50, 'Subject must be under 50 characters'),
	email: z.string().email('Invalid email address'),
	message: z.string().min(10, 'Message must be over 10 characters').max(500, 'Message must be under 500 characters'),
});

export type ContactForm = typeof contactSchema;

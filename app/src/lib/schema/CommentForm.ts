import { z } from 'zod';

export const commentFormSchema = z.object({
	displayName: z.string(),
	content: z.string(),
	botCheck: z.boolean().optional(),
});

export type CommentForm = typeof commentFormSchema;

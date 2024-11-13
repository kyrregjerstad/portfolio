import { z } from 'zod';

export const commentFormSchema = z.object({
	author: z.string(),
	content: z.string(),
});

export type CommentForm = typeof commentFormSchema;

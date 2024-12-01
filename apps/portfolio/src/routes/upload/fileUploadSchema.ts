import { z } from 'zod';

export const fileUploadSchema = z.object({
	file: z
		.instanceof(File, { message: 'Please upload a file.' })
		.refine((f) => f.size < 1_000_000_000, 'Max 1gb upload size.'),
	expiryHours: z.coerce.number().min(1, 'Expiry time must be at least 1 hour.'),
});

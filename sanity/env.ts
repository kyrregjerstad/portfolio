import { z } from 'zod';

const envSchema = z.object({
	ENV: z.union([z.literal('development'), z.literal('testing'), z.literal('production')]).default('development'),
	SANITY_STUDIO_PROJECT_ID: z.string().min(1),
	SANITY_STUDIO_DATASET: z.string().min(1),
	SANITY_STUDIO_PREVIEW_URL: z.string().url().optional(),
});

const env = envSchema.parse(process.env);

export default env;

import { z } from 'zod';

const envSchema = z.object({
	ENV: z.union([z.literal('development'), z.literal('testing'), z.literal('production')]).default('development'),
	SANITY_STUDIO_PROJECT_ID: z.string().min(1),
	SANITY_STUDIO_DATASET: z.string().min(1),
	SANITY_STUDIO_PREVIEW_URL: z.string().url().optional(),
});

// we need to set up the env's like this so that sanity can reference and bundle them during build time
const ENV = process.env.ENV || 'development';
const SANITY_STUDIO_DATASET = process.env.SANITY_STUDIO_DATASET;
const SANITY_STUDIO_PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID;
const SANITY_STUDIO_PREVIEW_URL = process.env.SANITY_STUDIO_PREVIEW_URL;

const env = envSchema.parse({
	ENV,
	SANITY_STUDIO_PROJECT_ID,
	SANITY_STUDIO_DATASET,
	SANITY_STUDIO_PREVIEW_URL,
});

export default env;

import { defineCliConfig } from 'sanity/cli';
import env from './env';

export default defineCliConfig({
	api: {
		projectId: env.SANITY_STUDIO_PROJECT_ID,
		dataset: env.SANITY_STUDIO_DATASET,
	},
});

import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { presentationTool } from 'sanity/presentation';
import { groqdPlaygroundTool } from 'groqd-playground';

import { schemaTypes } from './schemas';
import env from './env';

export default defineConfig({
	name: 'portfolio',
	title: 'Portfolio',
	projectId: env.SANITY_STUDIO_PROJECT_ID,
	dataset: env.SANITY_STUDIO_DATASET,
	plugins: [
		structureTool(),
		presentationTool({
			previewUrl: {
				origin: env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:5173',
				previewMode: {
					enable: '/preview/enable',
					disable: '/preview/disable',
				},
			},
		}),
		visionTool(),
		groqdPlaygroundTool(),
	],
	schema: {
		types: schemaTypes,
	},
});

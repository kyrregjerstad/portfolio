import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { presentationTool } from 'sanity/presentation';
import { groqdPlaygroundTool } from 'groqd-playground';

import { schemaTypes } from './schemas';

export const projectId = process.env.SANITY_STUDIO_PROJECT_ID!;
export const dataset = process.env.SANITY_STUDIO_DATASET!;

export default defineConfig({
	name: 'portfolio',
	title: 'Portfolio',
	projectId,
	dataset,
	plugins: [
		structureTool(),
		presentationTool({
			previewUrl: {
				origin: process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:5173',
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

import { createClient } from '@sanity/client';
import { makeSafeQueryRunner } from 'groqd';
import { apiVersion, projectId, dataset, studioUrl } from '$lib/sanity/api';

export const client = createClient({
	projectId,
	dataset,
	apiVersion,
	useCdn: process.env.NODE_ENV === 'production', // To always get fresh data in dev mode
	stega: {
		studioUrl,
	},
});

export const runQuery = makeSafeQueryRunner((query) => client.fetch(query));

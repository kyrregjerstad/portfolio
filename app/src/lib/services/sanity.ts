import { createClient } from '@sanity/client';
import { makeSafeQueryRunner } from 'groqd';
import { apiVersion, projectId, dataset, studioUrl } from '$lib/sanity/api';

const client = createClient({
	projectId,
	dataset,
	apiVersion,
	useCdn: true,
	stega: {
		studioUrl,
	},
});

export const runQuery = makeSafeQueryRunner((query) => client.fetch(query));

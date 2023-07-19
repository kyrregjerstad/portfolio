import * as Sentry from "@sentry/sveltekit";
import { collectionsQuery, type Collections } from "$queries/collectionsQuery";
import { runQuery } from "./runQuery";

export const getCollections = async (): Promise<Collections> => {
	const collections = await runQuery(collectionsQuery);

	collections.forEach((collection) => {
		if (!collection.photos) {
			console.error(`Collection ${collection.title} has no photos`);
			Sentry.captureMessage(`Collection ${collection.title} has no photos`, "log");
		}
	});
	return collections.reverse();
};

import { collectionQuery, type Collection } from "./queries/collectionQuery";
import { runQuery } from "./runQuery";
import * as Sentry from "@sentry/sveltekit";

export async function getCollection(slug: string): Promise<Collection | null> {
	try {
		const result = await runQuery(collectionQuery, { slug });
		return result;
	} catch (e) {
		Sentry.captureException(e);
		return null;
	}
}

import { pageQuery } from "./queries/pageQuery";
import type { Photos } from "./queries/photosQuery";
import { runQuery } from "./runQuery";

export async function getPhotosFromPage(pageName = ""): Promise<Photos> {
	const { photos } = await runQuery(pageQuery, { pageName });
	// reverse is to get the latest photos first
	return photos.reverse();
}

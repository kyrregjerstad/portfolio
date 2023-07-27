import { pageQuery } from "./queries/pageQuery";
import type { Page } from "./queries/pageQuery";
import { runQuery } from "./runQuery";

export async function getPageData(pageName = ""): Promise<Page> {
	try {
		return await runQuery(pageQuery, { pageName });
	} catch (e) {
		console.error(e);
		throw new Error("Failed to get page data: " + e);
	}
}

import { aboutQuery, type About } from "./queries/aboutQuery";
import { runQuery } from "./runQuery";

export async function getAboutText(): Promise<About> {
	const about = await runQuery(aboutQuery);
	return about;
}

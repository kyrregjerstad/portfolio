import { projectQuery } from "./queries/projectQuery";
import type { Project } from "./queries/projectQuery";
import { runQuery } from "./runQuery";

export async function getProject(slug = ""): Promise<Project> {
	try {
		return await runQuery(projectQuery, { slug });
	} catch (e) {
		console.error(e);
		throw new Error("Failed to get project: " + e);
	}
}

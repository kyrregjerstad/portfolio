import { q, type InferType } from "groqd";

export const pageQuery = q("*", { isArray: true })
	.filterByType("page")
	.filter("title == $pageName")
	.slice(0)
	.grab({
		heading: q.string(),
		description: q.string(),
		projects: q("*", { isArray: true })
			.filterByType("project")
			.grab({
				title: q.string(),
				slug: q.object({
					current: q.string()
				})
			})
	});

export type Page = InferType<typeof pageQuery>;
export type Project = InferType<typeof pageQuery>["projects"][0];

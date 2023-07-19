import { q, type InferType, sanityImage } from "groqd";

export const projectQuery = q("*", { isArray: false })
	.filterByType("project")
	.filter("slug.current == $slug")
	.slice(0)
	.grab({
		title: q.string(),
		description: q.string(),
		href: q.string(),
		linkTitle: q.string(),
		gitHubLink: q.string().nullable(),
		keyFeatures: q.array(q.string()).nullable(),
		images: sanityImage("images", { isList: true, withAsset: ["base"] }).nullable()
	});

export type Project = InferType<typeof projectQuery>;
export type Image = NonNullable<Project["images"]>[number];

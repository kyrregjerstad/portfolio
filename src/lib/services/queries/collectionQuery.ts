import { q, type InferType } from "groqd";
import { photosQuery } from "./photosQuery";

export const collectionQuery = q("*", { isArray: true })
	.filterByType("collection")
	.filter("slug.current == $slug")
	.slice(0, 1)
	.grab({
		title: q.string(),
		slug: q.object({
			current: q.string()
		}),
		date: q.string(),
		_id: q.string(),
		_createdAt: q.string(),
		_updatedAt: q.string(),
		description: q.string().nullable(),
		photos: photosQuery.nullable()
	})
	.slice(0);

export type Collection = InferType<typeof collectionQuery>;

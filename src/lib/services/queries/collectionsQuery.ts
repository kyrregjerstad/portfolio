import { q, type InferType } from "groqd";
import { photosQuery } from "./photosQuery";

export const collectionsQuery = q("*", { isArray: true })
	.filterByType("collection")
	.grab({
		title: q.string(),
		date: q.string(),
		_id: q.string(),
		_createdAt: q.string(),
		_updatedAt: q.string(),
		description: q.string().nullable(),
		slug: q.object({
			current: q.string()
		}),
		photos: photosQuery.nullable()
	});

export type Collections = InferType<typeof collectionsQuery>;

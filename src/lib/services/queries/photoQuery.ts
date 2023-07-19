import { sanityImage, type InferType, q } from "groqd";

export const photoQuery = q("*", { isArray: true })
	.filterByType("photo")
	.filter("_id == $photoId")
	.grab({
		_id: q.string(),
		_createdAt: q.string(),
		_updatedAt: q.string(),
		title: q.string(),
		image: sanityImage("image", {
			withAsset: ["base"]
		})
	})
	.slice(0);

export type Photo = InferType<typeof photoQuery>;

import { q, sanityImage, type InferType } from "groqd";

export const photosQuery = q("photos[]", { isArray: true })
	.deref()
	.grab({
		_id: q.string(),
		_createdAt: q.string(),
		_updatedAt: q.string(),
		title: q.string(),
		image: sanityImage("image", {
			withAsset: ["base"]
		})
	});

export type Photos = InferType<typeof photosQuery>;

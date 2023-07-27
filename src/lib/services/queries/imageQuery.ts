import { sanityImage, type InferType } from "groqd";

const image = sanityImage("image", {
	withAsset: ["base"]
});

export type Image = InferType<typeof image>;

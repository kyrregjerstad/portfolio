import imageUrlBuilder from "@sanity/image-url";
import { client } from "./initSanity";
import type { Image } from "$lib/services/queries/imageQuery";

const builder = imageUrlBuilder(client);

export function urlFor(source: Image) {
	return builder.image(source);
}

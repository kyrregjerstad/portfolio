import { createImageUrlBuilder } from '@sanity/image-url';
import { client } from '../services/sanity';

const builder = createImageUrlBuilder(client);

export function sanityImgUrl(source: string) {
	return builder.image(source);
}

import imageUrlBuilder from '@sanity/image-url';
import { client } from '../services/sanity';

const builder = imageUrlBuilder(client);

export function sanityImgUrl(source: string) {
	return builder.image(source);
}

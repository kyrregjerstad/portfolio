import { photoQuery, type Photo } from "./queries/photoQuery";
import { runQuery } from "./runQuery";

export async function getPhoto(photoId: string): Promise<Photo> {
	const photo = await runQuery(photoQuery, { photoId });
	return photo;
}

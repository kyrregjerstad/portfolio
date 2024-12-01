import { S3Client, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME } from '$env/static/private';

const s3 = new S3Client({
	region: 'auto',
	endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: R2_ACCESS_KEY_ID,
		secretAccessKey: R2_SECRET_ACCESS_KEY,
	},
});

export async function cleanupExpiredFiles() {
	try {
		const listCommand = new ListObjectsV2Command({
			Bucket: R2_BUCKET_NAME,
		});

		const { Contents } = await s3.send(listCommand);

		if (!Contents) return;

		const now = Date.now();

		for (const object of Contents) {
			const response = await s3.send(
				new DeleteObjectCommand({
					Bucket: R2_BUCKET_NAME,
					Key: object.Key,
				})
			);

			if (response.$metadata.httpStatusCode === 204) {
				console.log(`Deleted expired file: ${object.Key}`);
			}
		}
	} catch (error) {
		console.error('Error cleaning up expired files:', error);
	}
}

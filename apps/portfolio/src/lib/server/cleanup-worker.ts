import { S3Client, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { ENV } from 'varlock/env';

const s3 = new S3Client({
	region: 'auto',
	endpoint: `https://${ENV.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: ENV.R2_ACCESS_KEY_ID,
		secretAccessKey: ENV.R2_SECRET_ACCESS_KEY,
	},
});

export async function cleanupExpiredFiles() {
	try {
		const listCommand = new ListObjectsV2Command({
			Bucket: ENV.R2_BUCKET_NAME,
		});

		const { Contents } = await s3.send(listCommand);

		if (!Contents) return;

		const now = Date.now();

		for (const object of Contents) {
			const response = await s3.send(
				new DeleteObjectCommand({
					Bucket: ENV.R2_BUCKET_NAME,
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

import { error, json } from '@sveltejs/kit';
import { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME } from '$env/static/private';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { nanoid } from 'nanoid';

const s3 = new S3Client({
	region: 'auto',
	endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: R2_ACCESS_KEY_ID,
		secretAccessKey: R2_SECRET_ACCESS_KEY,
	},
});

export async function POST({ request }) {
	try {
		const formData = await request.formData();

		const file = formData.get('file') as File;
		const expiryHours = parseInt(formData.get('expiryHours') as string);

		if (!file) {
			throw error(400, 'No file provided');
		}

		const fileId = nanoid();
		const fileExtension = file.name.split('.').pop();
		const key = `${fileId}${fileExtension ? `.${fileExtension}` : ''}`;

		// Upload to R2
		await s3.send(
			new PutObjectCommand({
				Bucket: R2_BUCKET_NAME,
				Key: key,
				Body: Buffer.from(await file.arrayBuffer()),
				ContentType: file.type,
				Metadata: {
					originalName: file.name,
					expiryTime: (Date.now() + expiryHours * 60 * 60 * 1000).toString(),
				},
			})
		);

		// Generate public URL
		const url = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${key}`;

		return json({
			success: true,
			url,
		});
	} catch (err) {
		console.error(err);
		throw error(500, 'Failed to upload file');
	}
}

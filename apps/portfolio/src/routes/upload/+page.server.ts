import { R2_ACCESS_KEY_ID, R2_ACCOUNT_ID, R2_BUCKET_NAME, R2_SECRET_ACCESS_KEY } from '$env/static/private';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { nanoid } from 'nanoid';
import type { Actions } from './$types';

import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fileUploadSchema } from './fileUploadSchema';

const s3 = new S3Client({
	region: 'auto',
	endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: R2_ACCESS_KEY_ID,
		secretAccessKey: R2_SECRET_ACCESS_KEY,
	},
});

export const load = async () => {
	return {
		form: await superValidate(zod(fileUploadSchema)),
	};
};

export const actions = {
	upload: async ({ request }) => {
		try {
			const form = await superValidate(request, zod(fileUploadSchema));

			if (!form.valid) {
				return fail(400, { form });
			}

			const file = form.data.file;
			const expiryHours = form.data.expiryHours;

			if (!file) {
				return fail(400, { error: 'No file provided' });
			}

			const fileId = nanoid();
			const fileExtension = file.name.split('.').pop();
			const key = `${fileId}${fileExtension ? `.${fileExtension}` : ''}`;

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

			const url = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${key}`;

			return message(form, 'You have uploaded a valid file!');
		} catch (err) {
			console.error(err);
			return fail(500, { error: 'Failed to upload file' });
		}
	},
} satisfies Actions;

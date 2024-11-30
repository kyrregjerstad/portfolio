import { R2_ACCOUNT_ID, R2_BUCKET_NAME } from '$env/static/private';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { customAlphabet } from 'nanoid';

// Create a shorter ID generator (6 characters should be enough for personal use)

import type { Actions } from './$types';

import { s3 } from '@/lib/server/s3';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fileUploadSchema } from './fileUploadSchema';

const generateId = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 6);

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

			const fileId = generateId();
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

			const url = `/k/${fileId}`;
			return message(form, { message: 'File uploaded successfully!', url });
		} catch (err) {
			console.error(err);
			return fail(500, { error: 'Failed to upload file' });
		}
	},
} satisfies Actions;

import { GITHUB_USERNAME, R2_BUCKET_NAME } from '$env/static/private';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { customAlphabet } from 'nanoid';
import type { Actions } from './$types';

import { s3 } from '@/lib/server/s3';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fileUploadSchema } from './fileUploadSchema';
import { redirect } from '@sveltejs/kit';

const generateId = customAlphabet('23456789abcdefghjkmnpqrstuvwxyz', 6);

export const load = async ({ locals }) => {
	if (locals.user?.username !== GITHUB_USERNAME) {
		throw redirect(307, '/login');
	}

	return {
		form: await superValidate(zod(fileUploadSchema)),
	};
};

export const actions = {
	upload: async ({ request, locals }) => {
		if (locals.user?.username !== GITHUB_USERNAME) {
			throw redirect(307, '/login');
		}

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

import { PutObjectCommand } from '@aws-sdk/client-s3';
import { form, getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';
import { customAlphabet } from 'nanoid';
import { ENV } from 'varlock/env';
import { z } from 'zod';

import { s3 } from '@/lib/server/s3';

const generateId = customAlphabet('23456789abcdefghjkmnpqrstuvwxyz', 6);

const uploadSchema = z.object({
	file: z
		.instanceof(File, { message: 'Please upload a file.' })
		.refine((f) => f.size > 0, 'Please upload a file.')
		.refine((f) => f.size < 1_000_000_000, 'Max 1gb upload size.'),
	expiryHours: z.enum(['1', '24', '168']).default('1'),
});

export const uploadFile = form(uploadSchema, async ({ file, expiryHours: raw }) => {
	const expiryHours = Number(raw);
	const { locals } = getRequestEvent();
	if (locals.user?.username !== ENV.GITHUB_USERNAME) {
		error(401, 'Unauthorized');
	}

	try {
		const fileId = generateId();
		const fileExtension = file.name.split('.').pop();
		const key = `${fileId}${fileExtension ? `.${fileExtension}` : ''}`;

		await s3.send(
			new PutObjectCommand({
				Bucket: ENV.R2_BUCKET_NAME,
				Key: key,
				Body: Buffer.from(await file.arrayBuffer()),
				ContentType: file.type,
				Metadata: {
					originalName: file.name,
					expiryTime: (Date.now() + expiryHours * 60 * 60 * 1000).toString(),
				},
			}),
		);

		return { message: 'File uploaded successfully!', url: `/k/${fileId}` };
	} catch (err) {
		console.error(err);
		error(500, 'Failed to upload file');
	}
});

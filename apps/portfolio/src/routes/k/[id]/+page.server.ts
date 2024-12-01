import { error } from '@sveltejs/kit';
import { GetObjectCommand, HeadObjectCommand, ListObjectsCommand } from '@aws-sdk/client-s3';

import { R2_BUCKET_NAME } from '$env/static/private';
import { s3 } from '@/lib/server/s3';

export async function load({ params }) {
	const { id } = params;

	try {
		// Find matching files
		const possibleKeys = await listObjectsWithPrefix(id);
		if (possibleKeys.length === 0) {
			throw error(404, 'File not found');
		}

		const key = possibleKeys[0];

		// Get object metadata first
		const headResult = await s3.send(
			new HeadObjectCommand({
				Bucket: R2_BUCKET_NAME,
				Key: key,
			})
		);

		// Check expiry
		const expiryTime = Number(headResult.Metadata?.expiryTime || '0');
		if (expiryTime && Date.now() > expiryTime) {
			throw error(410, 'File has expired');
		}

		let content: string | undefined;

		// If it's a text file and not too large, fetch the content
		if (
			headResult.ContentType?.startsWith('text/') &&
			(headResult.ContentLength || 0) < 1_000_000 // Only load text files smaller than 1MB
		) {
			const obj = await s3.send(
				new GetObjectCommand({
					Bucket: R2_BUCKET_NAME,
					Key: key,
				})
			);

			if (obj.Body) {
				content = await obj.Body.transformToString();
			}
		}

		return {
			contentType: headResult.ContentType,
			metadata: headResult.Metadata || {},
			size: headResult.ContentLength || 0,
			content,
			key,
			fileUrl: `/k/${params.id}/file`,
		};
	} catch (err) {
		console.error(err);
		throw error(404, 'File not found');
	}
}

async function listObjectsWithPrefix(prefix: string) {
	try {
		const command = new ListObjectsCommand({
			Bucket: R2_BUCKET_NAME,
			Prefix: prefix,
		});

		const response = await s3.send(command);
		return response.Contents?.map((obj) => obj.Key || '') || [];
	} catch (err) {
		console.error('Error listing objects:', err);
		return [];
	}
}

import { error } from '@sveltejs/kit';
import { GetObjectCommand, ListObjectsCommand } from '@aws-sdk/client-s3';

import type { RequestHandler } from './$types';
import { R2_BUCKET_NAME } from '$env/static/private';
import { s3 } from '@/lib/server/s3';

export const GET: RequestHandler = async ({ params }) => {
	const { id } = params;

	try {
		// Get the object with all matching files from the parent route
		const possibleKeys = await listObjectsWithPrefix(id);
		if (possibleKeys.length === 0) {
			throw error(404, 'File not found');
		}

		const key = possibleKeys[0];
		const obj = await s3.send(
			new GetObjectCommand({
				Bucket: R2_BUCKET_NAME,
				Key: key,
			})
		);

		// Check if file has expired
		const expiryTime = Number(obj.Metadata?.expiryTime || '0');
		if (expiryTime && Date.now() > expiryTime) {
			throw error(410, 'File has expired');
		}

		// Get the body as a readable stream
		if (!obj.Body) {
			throw error(404, 'File content not found');
		}

		return new Response(obj.Body as ReadableStream, {
			headers: {
				'Content-Type': obj.ContentType || 'application/octet-stream',
				'Content-Disposition': `inline; filename="${obj.Metadata?.originalname || id}"`,
				// Add cache headers - cache for 1 hour unless file is close to expiry
				'Cache-Control': expiryTime
					? `public, max-age=${Math.min(3600, Math.floor((expiryTime - Date.now()) / 1000))}`
					: 'public, max-age=3600',
			},
		});
	} catch (err) {
		console.error('Error serving file:', err);
		throw error(404, 'File not found');
	}
};

// Helper function to list objects (same as in +page.server.ts)
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

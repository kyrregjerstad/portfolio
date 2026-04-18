import { ENV } from 'varlock/env';
import { S3Client } from '@aws-sdk/client-s3';

export const s3 = new S3Client({
	region: 'auto',
	endpoint: `https://${ENV.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: ENV.R2_ACCESS_KEY_ID,
		secretAccessKey: ENV.R2_SECRET_ACCESS_KEY,
	},
});

import { defineConfig } from 'drizzle-kit';
import { ENV } from 'varlock/env';

export default defineConfig({
	schema: './src/lib/db/schema.ts',
	out: './migrations',
	dialect: 'turso',
	dbCredentials: {
		url: ENV.TURSO_CONNECTION_URL,
		authToken: ENV.TURSO_AUTH_TOKEN,
	},
});

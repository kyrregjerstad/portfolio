import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { ENV } from 'varlock/env';
import * as schema from './schema';

const client = createClient({
	url: ENV.TURSO_CONNECTION_URL,
	authToken: ENV.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });

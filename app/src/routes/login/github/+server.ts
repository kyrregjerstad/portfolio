import { github } from '$lib/server/oauth';
import { generateState } from 'arctic';

import type { RequestEvent } from './$types';

export function GET(event: RequestEvent): Response {
	const state = generateState();
	const url = github.createAuthorizationURL(state, ['user:email']);

	// Get the return URL from the query parameter, default to '/'
	const returnTo = event.url.searchParams.get('returnTo') || '/';

	// Set both the state and returnTo cookies
	event.cookies.set('github_oauth_state', state, {
		httpOnly: true,
		maxAge: 60 * 10,
		secure: import.meta.env.PROD,
		path: '/',
		sameSite: 'lax',
	});

	event.cookies.set('github_oauth_return_to', returnTo, {
		httpOnly: true,
		maxAge: 60 * 10,
		secure: import.meta.env.PROD,
		path: '/',
		sameSite: 'lax',
	});

	return new Response(null, {
		status: 302,
		headers: {
			Location: url.toString(),
		},
	});
}

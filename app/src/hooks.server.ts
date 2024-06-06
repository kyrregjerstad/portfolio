import type { Handle } from '@sveltejs/kit';

export const handle = (async ({ event, resolve }) => {
	const themeCookie = event.cookies.get('theme');

	if (!themeCookie) {
		event.cookies.set('theme', 'dark', {
			path: '/',
			maxAge: 60 * 60 * 24 * 365, // 1 year
		});
	}

	const theme = themeCookie || 'dark';

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace(`data-theme=""`, `data-theme="${theme}"`),
	});
}) satisfies Handle;

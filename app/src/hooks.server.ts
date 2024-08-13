import type { Handle } from '@sveltejs/kit';

export const handle = (async ({ event, resolve }) => {
	const themeCookie = event.cookies.get('theme');
	const visited = event.cookies.get('visited');

	if (!themeCookie) {
		event.cookies.set('theme', 'dark', {
			path: '/',
			maxAge: 60 * 60 * 24 * 365, // 1 year
		});
	}

	if (!visited) {
		event.cookies.set('visited', 'true', {
			path: '/',
			maxAge: 60 * 60, // 1 hour
		});
	}

	const firstVisit = !visited;

	const theme = themeCookie || 'dark';

	event.locals.firstVisit = firstVisit;

	return resolve(event, {
		transformPageChunk: ({ html }) => {
			const transform1 = html.replace(`data-theme=""`, `data-theme="${theme}"`);
			const transform2 = transform1.replace(`data-firstVisit="true"`, `data-firstVisit="${firstVisit}"`);
			return transform2;
		},
	});
}) satisfies Handle;

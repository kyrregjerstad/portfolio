import type { Handle } from '@sveltejs/kit';

export const handle = (async ({ event, resolve }) => {
	const theme = event.cookies.get('theme') || 'dark';

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace(`data-theme=""`, `data-theme="${theme}"`),
	});
}) satisfies Handle;

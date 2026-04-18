import { redirect } from '@sveltejs/kit';
import { ENV } from 'varlock/env';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user?.username !== ENV.GITHUB_USERNAME) {
		throw redirect(307, '/login');
	}

	return {};
};

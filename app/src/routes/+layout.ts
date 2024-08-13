import posthog from 'posthog-js';
import { browser } from '$app/environment';
import { PUBLIC_POSTHOG_API_KEY, PUBLIC_POSTHOG_HOST } from '$env/static/public';
import type { Config } from '@sveltejs/adapter-vercel';

export const load = async () => {
	if (browser) {
		posthog.init(PUBLIC_POSTHOG_API_KEY, {
			api_host: PUBLIC_POSTHOG_HOST,
			capture_pageview: false,
			capture_pageleave: false,
		});
	}
	return;
};

export const config: Config = {
	runtime: 'edge',
};

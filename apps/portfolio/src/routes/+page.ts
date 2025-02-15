import type { Config } from '@sveltejs/adapter-vercel';

export const config: Config = {
	runtime: 'edge',
};

export const prerender = true;
export const ssr = true;

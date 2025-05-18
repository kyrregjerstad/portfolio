import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { escapeSvelte, mdsvex } from 'mdsvex';
import { createHighlighter } from 'shiki';

import rehypeUnwrapImages from 'rehype-unwrap-images';
import remarkToc from 'remark-toc';
import rehypeSlug from 'rehype-slug';

const theme = 'github-dark';
const highlighter = await createHighlighter({
	themes: [theme],
	langs: ['typescript', 'bash', 'svelte', 'tsx', 'json', 'yaml'],
});

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md', '.svx'],
	preprocess: [
		mdsvex({
			extensions: ['.md', '.svx'],
			highlight: {
				highlighter: async (code, lang = 'text') => {
					const html = escapeSvelte(highlighter.codeToHtml(code, { lang, theme }));
					return `<Components.pre>{@html \`${html}\`}</Components.pre>`;
				},
			},
			layout: {
				blog: import.meta.dirname + '/src/lib/layouts/BlogPostLayout.svelte',
			},
			remarkPlugins: [
				[
					remarkToc,
					{
						tight: true,
					},
				],
			],
			rehypePlugins: [rehypeSlug, rehypeUnwrapImages],
		}),
		vitePreprocess(),
	],
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),
		alias: {
			$lib: './src/lib',
			'@/*': './src/*',
		},
	},
};

export default config;

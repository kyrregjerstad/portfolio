import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import tailwindcss from '@tailwindcss/vite';
import { varlockVitePlugin } from '@varlock/vite-integration';

export default defineConfig({
	plugins: [varlockVitePlugin(), tailwindcss(), sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
	},
});

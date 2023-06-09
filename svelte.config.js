import adapter from "@sveltejs/adapter-vercel";
import { vitePreprocess } from "@sveltejs/kit/vite";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [vitePreprocess()],

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),
		alias: {
			$components: "./src/components",
			$scripts: "./src/lib/scripts",
			$config: "./src/lib/config/config.ts",
			$utils: "./src/lib/scripts/utils",
			$stores: "./src/lib/stores",
			$types: "./src/types.ts",
			$styles: "./src/styles",
			$assets: "./src/assets",
			$images: "./src/assets/images",
			$fonts: "./static/fonts"
		}
	},
	vitePlugin: {
		inspector: true
	}
};

export default config;

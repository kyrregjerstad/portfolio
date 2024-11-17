import eslint from '@eslint/js';
import pluginImport from 'eslint-plugin-import';
import svelteEslint from 'eslint-plugin-svelte';
import globals from 'globals';
import svelteParser from 'svelte-eslint-parser';
import tsEslint from 'typescript-eslint';

const testingDSL = {
	it: 'readonly',
	expect: 'readonly',
	describe: 'readonly',
};

const ignores = [
	// Sure, let's lint our lint config... :D
	// ./eslint.config.js
	'.DS_Store',
	'.env',
	'.env.*',
	'.github',
	// On CI our PNPM store is local to the application source
	'.pnpm-store/**/*',
	'.svelte-kit/**/*',
	'.vscode',
	'node_modules/**/*',
	'.vercel/**/*',
	'build/**/*',
	'package/**/*',

	// Ignore files for PNPM, NPM and YARN
	'pnpm-lock.yaml',
	'package-lock.json',
	'yarn.lock',

	// i18n dictionaries and auto-generated data
	'src/paraglide/**/*',
];

/** @type {import('eslint').Linter.Config[]} */
export default [
	{ ignores },
	// ...markdown.configs.recommended,
	eslint.configs.recommended,
	...tsEslint.configs.recommended,
	...svelteEslint.configs['flat/prettier'],
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: tsEslint.parser,
			},
			globals: {
				...globals.browser,
			},
		},
	},
	{
		files: ['**/*.svelte.test.ts'],
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: tsEslint.parser,
			},
			globals: {
				...globals.browser,
				...testingDSL,
			},
		},
	},
	{
		files: ['**/*.ts'],
		languageOptions: {
			parser: tsEslint.parser,
		},
	},
	{
		files: ['**/*.test.ts'],
		languageOptions: {
			parser: tsEslint.parser,
			globals: {
				...testingDSL,
			},
		},
	},
	{
		files: ['**/*server.ts'],
		languageOptions: {
			parser: tsEslint.parser,
			globals: {
				...globals.node,
			},
		},
	},
	{
		files: ['**/*server.test.ts'],
		languageOptions: {
			parser: tsEslint.parser,
			globals: {
				...globals.node,
				...testingDSL,
			},
		},
	},
	{
		plugins: {
			'@typescript-eslint': tsEslint.plugin,
			import: pluginImport,
		},
		rules: {
			semi: 'warn',
			'@typescript-eslint/no-unused-vars': 'warn',
		},
	},
];

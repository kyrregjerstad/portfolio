import globals from 'globals';
import svelteParser from 'svelte-eslint-parser';
import tsEslint from 'typescript-eslint';
import defaultConfig from './eslint.config.js';

const testingDSL = {
	it: 'readonly',
	expect: 'readonly',
	describe: 'readonly',
};

/** @type {import('eslint').Linter.Config[]} */
export default [
	...defaultConfig,
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
];

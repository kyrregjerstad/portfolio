/* eslint-disable @typescript-eslint/no-var-requires */
const postcssPresetEnv = require("postcss-preset-env");
const postcssOKLabFunction = require("@csstools/postcss-oklab-function");

/** @type {import('postcss-load-config').Config} */
const config = {
	plugins: [
		postcssPresetEnv({
			stage: 3,
			features: {
				"nesting-rules": true,
				"custom-media-queries": true,
				"media-query-ranges": true
			}
		}),
		postcssOKLabFunction()
	]
};

module.exports = config;

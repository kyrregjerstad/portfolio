import { fontFamily, screens } from 'tailwindcss/defaultTheme';

import type { Config } from 'tailwindcss';

const config = {
	darkMode: ['class'],
	content: ['./src/**/*.{html,js,svelte,ts}'],
	safelist: ['dark'],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			screens: {
				xs: '480px',
				...screens,
			},
			colors: {
				border: 'hsl(var(--border) / <alpha-value>)',
				input: 'hsl(var(--input) / <alpha-value>)',
				ring: 'hsl(var(--ring) / <alpha-value>)',
				background: 'hsl(var(--background) / <alpha-value>)',
				foreground: 'hsl(var(--foreground) / <alpha-value>)',
				primary: {
					DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
					foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
					foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
					foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
					foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
					foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
					foreground: 'hsl(var(--popover-foreground) / <alpha-value>)',
				},
				card: {
					DEFAULT: 'hsl(var(--card) / <alpha-value>)',
					foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			fontFamily: {
				sans: ['GeistMono', ...fontFamily.sans],
			},
			typography: (theme) => ({
				DEFAULT: {
					css: {
						color: theme('colors.primary.foreground'),
						'--tw-prose-body': theme('colors.primary.foreground'),
						'--tw-prose-headings': theme('colors.primary.foreground'),
						'--tw-prose-lead': theme('colors.primary.foreground'),
						'--tw-prose-links': theme('colors.primary.foreground'),
						'--tw-prose-bold': theme('colors.primary.foreground'),
						'--tw-prose-counters': theme('colors.primary.foreground'),
						'--tw-prose-bullets': theme('colors.primary.foreground'),
						'--tw-prose-numbers': theme('colors.primary.foreground'),
						'--tw-prose-hr': theme('colors.primary.foreground'),
						'--tw-prose-quotes': theme('colors.primary.foreground'),
						'--tw-prose-quote-borders': theme('colors.primary.foreground'),
						'--tw-prose-captions': theme('colors.primary.foreground'),
						'--tw-prose-code': theme('colors.primary.foreground'),
						'--tw-prose-pre-code': theme('colors.primary.foreground'),
						'--tw-prose-pre-bg': theme('colors.background'),
						'--tw-prose-th-borders': theme('colors.primary.foreground'),
						'--tw-prose-td-borders': theme('colors.primary.foreground'),
						'--tw-prose-invert-body': theme('colors.primary.foreground'),
						'--tw-prose-invert-headings': theme('colors.primary.foreground'),
						'--tw-prose-invert-links': theme('colors.primary.foreground'),
						'--tw-prose-invert-bold': theme('colors.primary.foreground'),
						'--tw-prose-invert-counters': theme('colors.primary.foreground'),
						'--tw-prose-invert-bullets': theme('colors.primary.foreground'),
						'--tw-prose-invert-numbers': theme('colors.primary.foreground'),
						'--tw-prose-invert-hr': theme('colors.primary.foreground'),
						'--tw-prose-invert-quotes': theme('colors.primary.foreground'),
						'--tw-prose-invert-quote-borders': theme('colors.primary.foreground'),
						'--tw-prose-invert-captions': theme('colors.primary.foreground'),
						'--tw-prose-invert-code': theme('colors.primary.foreground'),
						'--tw-prose-invert-pre-code': theme('colors.primary.foreground'),
						'--tw-prose-invert-pre-bg': theme('colors.background'),
					},
				},
			}),
		},
	},
	plugins: [require('@tailwindcss/typography')],
} satisfies Config;

export default config;

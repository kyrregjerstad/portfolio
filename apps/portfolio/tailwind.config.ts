import { fontFamily, screens } from 'tailwindcss/defaultTheme';
import tailwindcssAnimate from 'tailwindcss-animate';

import type { Config } from 'tailwindcss';

const config = {
	darkMode: ['class', '[data-theme="dark"]'],
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
				sans: ['Geist', ...fontFamily.sans],
				mono: ['GeistMono', ...fontFamily.mono],
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--bits-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--bits-accordion-content-height)' },
					to: { height: '0' },
				},
				'caret-blink': {
					'0%,70%,100%': { opacity: '1' },
					'20%,50%': { opacity: '0' },
				},
				'scale-bounce': {
					'0%,100%': { scale: '1' },
					'50%': { scale: '1.1' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'caret-blink': 'caret-blink 1.25s ease-out infinite',
				'scale-bounce': 'scale-bounce 0.75s ease-out infinite',
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
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	plugins: [tailwindcssAnimate, require('@tailwindcss/typography')],
} satisfies Config;

export default config;

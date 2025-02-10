<script lang="ts">
	import { cn } from '@/lib/utils';
	import {
		siDocker,
		siDrizzle,
		siNextdotjs,
		siPostgresql,
		siReact,
		siShadcnui,
		siSvelte,
		siTailwindcss,
		siTypescript,
	} from 'simple-icons';

	type Technology = {
		name: string;
		url: string;
		icon: {
			path: string;
			title: string;
		};
		filler?: boolean;
	};

	const technologies: Technology[] = [
		{
			name: 'TypeScript',
			url: 'https://typescriptlang.org',
			icon: siTypescript,
		},
		{
			name: 'React',
			url: 'https://react.dev',
			icon: siReact,
		},
		{
			name: 'Next.js',
			url: 'https://nextjs.org',
			icon: siNextdotjs,
		},
		{
			name: 'SvelteKit',
			url: 'https://kit.svelte.dev',
			icon: siSvelte,
		},
		{
			name: 'Tailwind',
			url: 'https://tailwindcss.com',
			icon: siTailwindcss,
		},
		{
			name: 'PostgreSQL',
			url: 'https://postgresql.org',
			icon: siPostgresql,
		},
		{
			name: 'Drizzle',
			url: 'https://orm.drizzle.team',
			icon: siDrizzle,
		},
		{
			name: 'Docker',
			url: 'https://docker.com',
			icon: siDocker,
		},
		{
			name: 'Shadcn',
			url: 'https://ui.shadcn.com',
			icon: siShadcnui,
			filler: true,
		},
	];
</script>

<div class="grid grid-cols-3 place-items-center gap-8 py-8 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-8">
	{#each technologies as tech}
		<a
			href={tech.url}
			target="_blank"
			rel="noopener noreferrer"
			class={cn(
				'bg-accent-foreground/10 flex aspect-square w-32 flex-col items-center justify-center gap-2 rounded-md backdrop-blur-sm transition-transform hover:scale-110',
				tech.filler && 'sm:hidden'
			)}
		>
			<svg role="img" viewBox="0 0 24 24" class="size-12 fill-current transition-colors"
				><title>{tech.icon.title}</title><path d={tech.icon.path} /></svg
			>
			<span class="text-center text-sm font-medium">
				{tech.name}
			</span>
		</a>
	{/each}
</div>

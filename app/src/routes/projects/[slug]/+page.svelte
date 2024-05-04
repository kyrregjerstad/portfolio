<script lang="ts">
	import Chip from '@/components/Chip.svelte';
	import LinkButton from '@/components/LinkButton.svelte';
	import PageNavigation from '@/components/PageNavigation.svelte';
	import { ExternalLinkIcon, GithubIcon, GraduationCap, Handshake, Heart, X } from 'lucide-svelte';

	const { data } = $props();
	const { project, nextProject, prevProject } = $derived(data);
</script>

<section>
	<div class="flex justify-between">
		<h1 class="pb-8 text-6xl font-bold tracking-tight">
			{project.title}
		</h1>
		<div class="flex flex-col gap-2">
			<a
				href="/"
				class="flex items-center gap-2 self-end opacity-50 transition-opacity hover:scale-110 hover:opacity-100"
			>
				<X size={20} />
				<span class="sr-only">home</span>
			</a>
			<PageNavigation {nextProject} {prevProject} />
		</div>
	</div>

	<section class="flex flex-wrap gap-8">
		<div>
			<h2 class="text-md pb-2">Meta:</h2>
			<div class="flex gap-2">
				{#if project.type}
					<Chip class="flex gap-2">
						{#if project.type === 'personal'}
							<Heart size={20} />
						{:else if project.type === 'professional'}
							<Handshake size={20} />
						{:else if project.type === 'academic'}
							<GraduationCap size={20} />
						{/if}

						{project.type}
					</Chip>
				{/if}
				{#if project.client}
					<Chip>{project.client}</Chip>
				{/if}
				{#if project.gitHubLink}
					<LinkButton href={project.gitHubLink}>
						<GithubIcon size={20} />
						GitHub
					</LinkButton>
				{/if}
				{#if project.href}
					<LinkButton href={project.href}>
						<ExternalLinkIcon size={20} />
						<span>{project.title}</span>
					</LinkButton>
				{/if}
			</div>
		</div>
		<div>
			<h2 class="text-md pb-2">Technologies:</h2>
			<div class="flex max-w-[800px] flex-wrap gap-2">
				{#each project.technologies as technology}
					<Chip>{technology.title}</Chip>
				{/each}
			</div>
		</div>
	</section>

	<hr class="border-foreground my-12 opacity-50" />

	<section class="prose max-w-[800px]">
		<p class="pb-8">
			{project.description}
		</p>
	</section>

	{#if project.images}
		<section class="flex max-w-[800px] flex-col gap-4">
			{#each project.images as image}
				<img src={image.asset.url} alt={project.title} />
			{/each}
		</section>
	{/if}
</section>

<hr class="border-foreground my-12 opacity-50" />

<div class="flex w-full justify-center">
	<div class="flex flex-col items-center justify-center gap-2">
		<PageNavigation {nextProject} {prevProject} class="grid grid-cols-[1fr_10px_1fr]" />
		<a href="/" class="flex items-center gap-2 opacity-50 transition-opacity hover:opacity-100">Home </a>
	</div>
</div>

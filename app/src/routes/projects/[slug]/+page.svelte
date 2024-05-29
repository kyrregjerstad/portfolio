<script lang="ts">
	import Likes from './Likes.svelte';

	import Chip from '@/components/Chip.svelte';
	import Gallery from '@/components/Gallery.svelte';
	import LinkButton from '@/components/LinkButton.svelte';
	import PageNavigation from '@/components/PageNavigation.svelte';
	import { ExternalLinkIcon, GithubIcon, X } from 'lucide-svelte';

	import Divider from '@/components/Divider.svelte';
	import ProjectTypeChip from '@/components/ProjectTypeChip.svelte';
	import PortableText from '@/lib/portableText/PortableText.svelte';

	const { data, form: likeFormAction } = $props();
	const { project, nextProject, prevProject, likes } = $derived(data);

	$inspect('page ', likeFormAction);
</script>

<div class="flex flex-col-reverse justify-between pb-8 sm:flex-row">
	<h1 class="text-pretty break-words text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
		{project.title}
	</h1>
	<div class="flex flex-row-reverse justify-between gap-2 sm:flex-col">
		<a
			href="/"
			class="flex items-center gap-2 self-end opacity-50 transition-opacity hover:scale-110 hover:opacity-100"
		>
			<X class="size-10 sm:size-6" />
			<span class="sr-only">home</span>
		</a>
		<PageNavigation {nextProject} {prevProject} />
	</div>
</div>

<section class="flex flex-col gap-8">
	<div>
		<h2 class="text-md pb-2">Meta:</h2>
		<div class="flex flex-wrap gap-2">
			{#if project.type}
				<ProjectTypeChip type={project.type} />
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

<Divider />

<section class="prose w-full max-w-4xl pb-8 text-left">
	{#if project.richDescription}
		<PortableText portableText={project.richDescription} />
	{:else}
		<p>
			{project.description}
		</p>
	{/if}
</section>

{#if project.images && project.images.length > 0}
	<Gallery
		images={project.images.map((image, i) => ({
			src: image.asset.url,
			alt: `Kyrre Gjerstad - ${project.title} screenshot ${i + 1}`,
		}))}
	/>
{/if}
<div class="flex w-full items-center justify-center pt-12">
	<Likes {likes} {likeFormAction} />
</div>

<div class="flex-1"></div>
<Divider />
<div class="flex w-full justify-center self-end justify-self-end pb-6">
	<div class="flex flex-col items-center justify-center gap-2">
		<PageNavigation {nextProject} {prevProject} class="grid grid-cols-[1fr_10px_1fr]" />
		<a href="/" class="flex items-center gap-2 opacity-50 transition-opacity hover:opacity-100">Home </a>
	</div>
</div>

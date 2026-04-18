<script lang="ts">
	import Chip from '@/components/Chip.svelte';
	import Gallery from '@/components/Gallery.svelte';
	import LinkButton from '@/components/LinkButton.svelte';
	import PageNavigation from '@/components/PageNavigation.svelte';
	import { ExternalLinkIcon, X } from '@lucide/svelte';

	import Divider from '@/components/Divider.svelte';
	import ProjectTypeChip from '@/components/ProjectTypeChip.svelte';
	import PortableText from '@/lib/portableText/PortableText.svelte';
	import { scrollToTop } from '@/lib/utils';
	import AnimatedCounter from '@/routes/AnimatedCounter.svelte';
	import type { PortableTextBlock } from '@portabletext/types';

	let { data } = $props();
	let { project, nextProject, prevProject } = $derived(data);
</script>

<div class="flex w-full flex-col-reverse justify-between pb-8 sm:flex-row">
	<h1 class="text-pretty break-words text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
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
			{#if project.gitHubLink}
				<LinkButton href={project.gitHubLink}>
					<svg
						class="size-4 sm:size-6"
						viewBox="0 0 24 24"
						fill="currentColor"
						aria-hidden="true"
					>
						<path
							d="M12 .5C5.73.5.67 5.57.67 11.84c0 5.01 3.24 9.26 7.74 10.76.57.1.78-.25.78-.55 0-.27-.01-.99-.02-1.95-3.15.68-3.82-1.52-3.82-1.52-.51-1.3-1.26-1.65-1.26-1.65-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.73 2.65 1.23 3.3.94.1-.73.4-1.23.72-1.51-2.52-.29-5.16-1.26-5.16-5.6 0-1.24.44-2.25 1.17-3.04-.12-.29-.51-1.44.11-3 0 0 .96-.31 3.15 1.17.91-.25 1.89-.38 2.86-.38.97 0 1.95.13 2.86.38 2.19-1.48 3.15-1.17 3.15-1.17.62 1.56.23 2.71.11 3 .73.79 1.17 1.8 1.17 3.04 0 4.35-2.64 5.3-5.17 5.59.41.35.77 1.04.77 2.1 0 1.52-.01 2.75-.01 3.12 0 .3.21.66.79.55 4.49-1.5 7.73-5.75 7.73-10.76C23.33 5.57 18.27.5 12 .5z"
						/>
					</svg>
					GitHub
				</LinkButton>
			{/if}
			{#if project.href}
				<LinkButton href={project.href}>
					<ExternalLinkIcon class="size-4 sm:size-6" />
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

<section class="prose text-foreground prose-bold:text-foreground! w-full max-w-full text-left leading-loose">
	<!-- Not sure why we need the key here, but it seems to be necessary for the rich description to update -->
	{#key project.title}
		{#if project.richDescription}
			<PortableText portableText={project.richDescription as PortableTextBlock[]} />
		{:else}
			<p>
				{project.description}
			</p>
		{/if}
	{/key}
</section>

{#if project.images && project.images.length > 0}
	<Gallery
		images={project.images.map((image, i) => ({
			src: image.asset?.url ?? '',
			alt: `Kyrre Gjerstad - ${project.title} screenshot ${i + 1}`,
			blurHash: image.asset?.metadata?.blurHash ?? '',
		}))}
	/>
{/if}

<div class="flex w-full items-center justify-center py-8">
	<AnimatedCounter initialLikes={data.likes} slug={data.slug} />
</div>

<div class="flex-1"></div>
<div class="flex w-full justify-center self-end justify-self-end">
	<div class="flex flex-col items-center justify-center gap-2">
		<PageNavigation {nextProject} {prevProject} class="grid grid-cols-[1fr_10px_1fr]" />
		<a href="/" class="flex items-center gap-2 opacity-50 transition-opacity hover:opacity-100" onclick={scrollToTop}
			>Home
		</a>
	</div>
</div>

<script lang="ts">
	import { cn } from '@/lib/utils/cn';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';

	type Project = {
		title: string;
		slug: string;
	};
	type Props = {
		prevProject: Project | null;
		nextProject: Project | null;
		class?: string;
	};
	let { nextProject, prevProject, class: className }: Props = $props();
</script>

<div class={cn('group flex h-fit grid-cols-[1fr_10px_1fr] gap-2 text-sm', className)}>
	<div class="justify-self-end opacity-50 transition-opacity hover:opacity-100">
		{#if prevProject}
			<div class="group grid">
				<span class="transition-all hover:-translate-x-1 hover:font-bold hover:text-teal-500">
					<a href={`${prevProject.slug}`} class="flex items-center gap-1">
						<ChevronLeft size={20} />
						{prevProject.title}</a
					>
				</span>
			</div>
		{:else}
			<div class="grid">
				<span class="flex items-center opacity-50"> - </span>
			</div>
		{/if}
	</div>
	<span class="pointer-events-none flex justify-center opacity-50 group-hover:opacity-100"> | </span>
	<div class="w-fit opacity-50 transition-opacity hover:opacity-100">
		{#if nextProject}
			<div class="group grid">
				<span class="relative transition-all hover:translate-x-1 hover:font-bold hover:text-teal-500">
					<a href={`${nextProject.slug}`} class="flex items-center gap-1"
						>{nextProject.title}
						<ChevronRight size={20} />
					</a>
				</span>
			</div>
		{:else}
			<div class="grid">
				<span class="flex items-center opacity-50"> - </span>
			</div>
		{/if}
	</div>
</div>

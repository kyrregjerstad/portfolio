<script lang="ts">
	import ProjectCard from '@/components/ProjectCard.svelte';

	type Project = {
		title: string;
	};

	let { projects }: { projects: Project[] } = $props();
	let distanceFromTop = $state(0);
	let container: HTMLDivElement | null = $state(null);

	$effect(() => {
		const updateDistance = () => {
			if (container) {
				const rect = container.getBoundingClientRect();
				distanceFromTop = rect.top + window.scrollY;
			}
		};

		// Initial calculation
		updateDistance();

		// Update on resize
		window.addEventListener('resize', updateDistance, { passive: true });

		return () => {
			window.removeEventListener('resize', updateDistance);
		};
	});

	const stickyOffset = 128;
</script>

<div
	class="perspective-container flex snap-y snap-mandatory flex-col items-center justify-center gap-4"
	bind:this={container}
>
	{#each projects as project, i}
		<ProjectCard title={project.title} index={i} {stickyOffset} />
	{/each}
</div>

<style>
	.perspective-container {
		perspective: 1000px;
		transform-style: preserve-3d;
	}
</style>

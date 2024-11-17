<script lang="ts">
	import { scrollStore } from '$lib/stores/scrollStore.svelte';

	type Project = {
		title: string;
	};

	let { projects }: { projects: Project[] } = $props();
	let distanceFromTop = $state(0);
	let container: HTMLDivElement;

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
		window.addEventListener('resize', updateDistance);

		return () => {
			window.removeEventListener('resize', updateDistance);
		};
	});
	const offset = 128;

	let transformValue = $derived(Math.max(0, (scrollStore.scrollY - distanceFromTop) / offset));
	let zValue = $derived(Math.max(0, (scrollStore.scrollY - distanceFromTop) / offset));
</script>

<div class="perspective-container flex flex-col items-center justify-center gap-4" bind:this={container}>
	{#each projects as project, i}
		<div
			class="border-muted-foreground card sticky flex max-w-screen-sm flex-col rounded-sm border bg-black p-6"
			style="top: {128 + i * 16}px; transform: translate3d({i * 10 - transformValue}px, 0, 0px)"
		>
			<h3 class="pb-2 text-xl font-bold">{project.title}</h3>
			<div class="aspect-video rounded-sm bg-neutral-800"></div>
			<p class="pt-8">
				Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti aperiam, aspernatur rem illum doloribus id
				eveniet voluptatum tenetur dolore animi rerum quaerat, exercitationem in maiores accusamus iste eum consequatur
				culpa!
			</p>
		</div>
	{/each}
</div>

<style>
	.perspective-container {
		perspective: 1000px;
		transform-style: preserve-3d;
	}

	.card {
		transform-style: preserve-3d;
		backface-visibility: hidden;
	}
</style>

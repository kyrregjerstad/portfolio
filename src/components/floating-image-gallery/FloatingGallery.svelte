<script lang="ts">
	import { onMount } from "svelte";
	import { tweened } from "svelte/motion";
	import { cubicOut } from "svelte/easing";
	import { urlFor } from "$lib/utils/image";
	import type { Image } from "$lib/services/queries/projectQuery";
	import type { Project } from "$lib/services/queries/projectQuery";

	export let project: Project | null = null;

	let mousePos = { x: 0, y: 0 };
	let windowSize = { x: 0, y: 0 };
	let mouseNormalized = { x: 0, y: 0 };
	const scalingFactor = 100;

	function updateWindowSize() {
		windowSize.x = window.innerWidth;
		windowSize.y = window.innerHeight;
	}

	onMount(() => {
		updateWindowSize();
	});

	$: {
		mouseNormalized.x = mousePos.x / windowSize.x - 0.5 * scalingFactor;
		mouseNormalized.y = mousePos.y / windowSize.y - 0.5 * scalingFactor;
	}

	const mouseNormalizedTweened = tweened(
		{ x: 0, y: 0 },
		{
			duration: 2000,
			easing: cubicOut
		}
	);

	$: {
		mouseNormalizedTweened.set(mouseNormalized);
	}

	let hoveredImage = -1;

	function transformImage(i: number, hoveredImage: number) {
		const translateX = i * -1 + (-$mouseNormalizedTweened.x / scalingFactor) * 10;
		const translateY = i * -10 + (-$mouseNormalizedTweened.y / scalingFactor) * 10;
		const scaleValue = hoveredImage !== -1 && hoveredImage !== i ? 1 - Math.abs(i - hoveredImage) * 0.1 : 1;
		return `transform: translate3d(${translateX}%, ${translateY}%, 0) scale3d(${scaleValue}, ${scaleValue}, 1);`;
	}
</script>

<svelte:window
	on:mousemove={(e) => {
		mousePos.x = e.clientX;
		mousePos.y = e.clientY;
	}}
	on:resize={() => {
		windowSize.x = window.innerWidth;
		windowSize.y = window.innerHeight;
	}}
/>

<div class="container">
	{#if project && project?.images}
		{#each project.images as image, i}
			<div
				class="float-wrapper"
				style="animation: float {10}s {i}s ease-in-out infinite, fade-in 1s {i / 3 + 0.5}s ease-in-out forwards;"
			>
				<!-- svelte-ignore a11y-mouse-events-have-key-events -->
				<div
					class="image-wrapper"
					style={transformImage(i, hoveredImage)}
					on:mouseover={() => (hoveredImage = i)}
					on:mouseout={() => (hoveredImage = -1)}
				>
					<img
						src={urlFor(image).width(1056).auto("format").url()}
						alt="Screenshot {i} of {project.title}, can be found at: {project.href}"
					/>
				</div>
			</div>
		{/each}
	{/if}
</div>

<style>
	.container {
		position: relative;
		max-width: 60rem;
		transform: translateX(-0.5rem);
	}

	.container:has(img:hover) img:not(:hover) {
		opacity: 0.5;
		filter: blur(3px);
	}

	.image-wrapper {
		position: relative;
		transition: transform 350ms ease-in-out;
	}

	img {
		transition: all 350ms ease-in-out;
		border: 1px solid var(--color-transparent-medium);
	}

	img:hover {
		transform: scale3d(1.1, 1.1, 1.1) translateX(-1.1rem);
		z-index: 100;
	}

	.float-wrapper {
		position: relative;
		transition: z-index 1ms 350ms;
		opacity: 0;
	}

	.float-wrapper:hover {
		z-index: 100;
	}

	@keyframes -global-float {
		0% {
			transform: translate3d(0, 0, 0);
		}
		50% {
			transform: translate3d(0.5rem, 1rem, 0);
		}
		100% {
			transform: translate3d(0, 0, 0);
		}
	}

	@keyframes -global-fade-in {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
</style>

<script lang="ts">
	import { scrollStore } from '@/lib/stores/scrollStore.svelte';
	import { onMount } from 'svelte';

	type Props = {
		title: string;
		index: number;
		stickyOffset: number;
	};

	let { title, index, stickyOffset }: Props = $props();

	let card = $state<HTMLElement | null>(null);
	let nextCard = $state<HTMLElement | null>(null);
	let scrollStartPosition = $state<number | null>(null);
	let scrollProgress = $state<number>(0);
	let hasStartedTransform = $state(false);

	function isSticky(element: HTMLElement | null): boolean {
		if (!element) return false;
		const rect = element.getBoundingClientRect();
		const computedStyle = window.getComputedStyle(element);
		const stickyTop = parseInt(computedStyle.top);

		const offset = 25;

		return computedStyle.position === 'sticky' && Math.abs(rect.top - stickyTop) < offset && rect.top >= 0;
	}

	onMount(() => {
		nextCard = card?.nextElementSibling as HTMLElement;
	});

	let isNextElementSticky = $derived.by(() => {
		const _ = scrollStore.scrollY;
		return isSticky(nextCard);
	});

	$effect(() => {
		const currentScrollY = scrollStore.scrollY;

		if (isNextElementSticky) {
			// Initialize start position when next card becomes sticky for the first time
			if (scrollStartPosition === null) {
				scrollStartPosition = currentScrollY;
				hasStartedTransform = true;
			}
			// Calculate progress from when the next card became sticky
			scrollProgress = currentScrollY - scrollStartPosition;
		} else if (hasStartedTransform && scrollStartPosition) {
			// Continue the transform, but update progress relative to current scroll
			scrollProgress = currentScrollY - scrollStartPosition;
		} else {
			// Only reset if we haven't started transforming yet
			scrollStartPosition = null;
			scrollProgress = 0;
		}
	});

	let style = $derived.by(() => {
		const spacing = 150;
		const opacityOffset = 3000;
		const blurOffset = 500;
		const translateX = Math.min(-scrollProgress / spacing, 0);
		const translateZ = Math.min(-scrollProgress / spacing, 0);
		const opacity = Math.max(1 - scrollProgress / opacityOffset, 0).toFixed(2);
		const blur = Math.max(scrollProgress / blurOffset, 0).toFixed(2);

		if (index === 0) {
			$inspect(blur);
		}

		return `transform: translate3d(${translateX}%, 0, ${translateZ}px); opacity: ${opacity}; filter: blur(${blur}px);`;
	});
</script>

<div
	class="border-muted-foreground card sticky flex max-w-screen-sm flex-col rounded-sm border bg-black p-6"
	style="top: 100px; {style};"
	bind:this={card}
>
	<h3 class="pb-2 text-xl font-bold">{title}</h3>
	<div class="aspect-video rounded-sm bg-neutral-800"></div>
	<p class="pt-8">
		Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti aperiam, aspernatur rem illum doloribus id
		eveniet voluptatum tenetur dolore animi rerum quaerat, exercitationem in maiores accusamus iste eum consequatur
		culpa!
	</p>
</div>

<style>
	.card {
		transform-style: preserve-3d;
		backface-visibility: hidden;
	}
</style>

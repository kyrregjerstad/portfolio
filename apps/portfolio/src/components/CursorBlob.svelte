<script lang="ts">
	import { cubicOut } from 'svelte/easing';
	import { Tween } from 'svelte/motion';
	import { fly } from 'svelte/transition';
	type Props = {
		position: { x: number; y: number };
	};
	let { position }: Props = $props();

	const tween = new Tween(
		{ x: position.x, y: position.y },
		{
			duration: 5_000,
			easing: cubicOut,
		}
	);

	$effect(() => {
		tween.target = { x: position.x, y: position.y };
	});

	let transform = $derived.by(() => {
		const pageContent = document.querySelector('#page-content');
		if (!pageContent) return `translate3d(${tween.current.x}px, ${tween.current.y}px, 0)`;

		return `translate3d(${tween.current.x}px, ${tween.current.y - pageContent.scrollTop}px, 0)`;
	});

	const colorOptions = [
		['oklch(69% 0.286 360)', 'oklch(50% 0.286 360)'],
		['oklch(50% 0.1 190)', 'oklch(65.41% 0.111 202)'],
		['oklch(30% 0.2 220.24)', 'oklch(30% 0.4 309)'],
		['oklch(40% 0.2 160.24)', 'oklch(60% 0.2 170.24)'],
	];

	const color = $derived(colorOptions[Math.floor(Math.random() * colorOptions.length)]);
</script>

<div
	class="blob pointer-events-none absolute left-0 top-0 z-50 size-10 select-none rounded-full"
	style:transform
	style:background={`linear-gradient(30deg, ${color[0]} 0%, ${color[1]} 100%)`}
></div>

<style>
	.blob {
		filter: blur(10px);
		animation: fadeIn 5s ease-in-out forwards;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			scale: 0;
		}
		to {
			opacity: 0.5;
			scale: 1;
		}
	}
</style>

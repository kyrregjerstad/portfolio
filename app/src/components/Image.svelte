<script lang="ts">
	import { cn } from '@/lib/utils';
	import { decodeBlurHash } from 'fast-blurhash';
	import { onMount } from 'svelte';

	type Props = {
		src: string;
		alt: string;
		blurHash: string | null;
	};
	const { src, alt, blurHash }: Props = $props();

	let loading = $state(true);
	let prevSrc = $state('');
	let canvas = $state<HTMLCanvasElement | null>(null);

	const pixels = decodeBlurHash(blurHash || '', 500, 500);

	$effect(() => {
		if (src !== prevSrc) {
			loading = true;
		}
		prevSrc = src;
	});

	onMount(() => {
		if (canvas) {
			const ctx = canvas.getContext('2d');
			if (!ctx) return;
			const imageData = ctx.createImageData(500, 500);
			imageData.data.set(pixels);
			ctx.putImageData(imageData, 0, 0);
		}
	});
</script>

<div class="relative aspect-[6/4] overflow-hidden rounded-lg">
	<canvas
		bind:this={canvas}
		class={cn('absolute z-30 h-full w-full object-cover transition-opacity', loading ? 'opacity-100' : 'opacity-0')}
	></canvas>

	<img
		{src}
		{alt}
		class={cn('max-h-full w-full transform-gpu  object-cover transition-transform hover:scale-105', {
			'blur-sm': loading,
			'blur-none': !loading,
		})}
		onload={() => (loading = false)}
		loading="lazy"
	/>
</div>

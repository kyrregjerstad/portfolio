<script lang="ts">
	import { X } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	import Image from './Image.svelte';

	type Image = {
		src: string;
		alt: string;
		blurHash: string | null;
	};

	type Props = {
		images: Image[];
	};
	let { images }: Props = $props();

	let selectedImage = $state<Image | null>(null);
</script>

<div class="grid grid-cols-1 gap-4 pt-8 sm:grid-cols-2">
	{#each images as { src, alt, blurHash }, i}
		<button onclick={() => (selectedImage = { src, alt, blurHash })}>
			<Image {src} {alt} {blurHash} />
		</button>
	{/each}
</div>

<div>
	{#if selectedImage}
		<div class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm transition-all" transition:fly>
			<div
				class="fixed inset-0 bg-black bg-opacity-50"
				role="presentation"
				onclick={() => (selectedImage = null)}
			></div>
			<div class="relative z-10 max-w-[1200px] p-10">
				<img src={selectedImage.src} alt={selectedImage.alt} class="rounded-lg" />
				<button
					class="absolute right-5 top-5 m-4 rounded-full bg-black bg-opacity-50 p-2 text-white"
					onclick={() => (selectedImage = null)}
				>
					<X />
					<span class="sr-only"> close </span>
				</button>
			</div>
		</div>
	{/if}
</div>

<svelte:window on:keyup|window={(e) => e.key === 'Escape' && (selectedImage = null)} />

<script lang="ts">
	import { enhance } from '$app/forms';
	import { spring } from 'svelte/motion';
	import { Particles } from './particles.svelte';

	type Props = {
		likes: number;
		likeFormAction: {
			likeCount: number;
			message?: string;
		} | null;
	};

	let { likes, likeFormAction }: Props = $props();
	let scale = spring(1, { stiffness: 0.2, damping: 0.4 });
	let button = $state<HTMLButtonElement | null>(null);
	let particles = $state<Particles | null>(null);

	$effect(() => {
		if (likeFormAction) {
			likes = likeFormAction.likeCount;
		}
	});

	$effect(() => {
		if (button) {
			particles = new Particles(button);
		}
	});

	const handleMouseDown = (event: MouseEvent) => {
		likes++; // Optimistically increment likes
		// scale.set(1.4); // Scale up
		// setTimeout(() => scale.set(1), 150); // Scale back down
		particles?.trigger();
	};
</script>

<div class="flex flex-col items-center justify-center gap-2">
	<p class="text-foreground break-words text-center text-sm">{likeFormAction?.message}</p>
	<form use:enhance class="flex items-center gap-1">
		<div>{likes}</div>
		<div class="relative">
			<button
				bind:this={button}
				onmousedown={handleMouseDown}
				class="hover:text-primary aspect-square rounded-md px-2 transition-colors duration-200"
				style="transform: scale({$scale}); transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
				type="button">❤️</button
			>
			{#each particles?.getParticles() || [] as particle (particle.id)}
				<div
					class="pointer-events-none fixed text-xs"
					style="left: {particle.position.x}px; top: {particle.position
						.y}px; transform: scale({particle.scale}); opacity: {particle.opacity};"
				>
					❤️
				</div>
			{/each}
		</div>
	</form>
</div>

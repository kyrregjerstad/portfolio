<script lang="ts">
	import { enhance } from '$app/forms';
	import { spring } from 'svelte/motion';
	import { Particles } from './particles.svelte';
	import { onDestroy } from 'svelte';
	import { cn } from '@/lib/utils';

	type Props = {
		likes: number;
		likeFormAction: {
			likeCount: number;
			message?: string;
		} | null;
	};

	let { likes, likeFormAction }: Props = $props();
	let scale = spring(1, { stiffness: 0.2, damping: 0.4 });

	let particleSystem = $state<Particles>(new Particles({ speed: 0.75 }));
	let particles = $derived(particleSystem.getParticles() || []);
	let isHovering = $state(false);
	let isDown = $state(false);

	$inspect('isHovering', isHovering);
	$inspect('isDown', isDown);

	$effect(() => {
		if (likeFormAction) {
			likes = likeFormAction.likeCount;
		}

		return () => {
			particleSystem.cleanup();
		};
	});

	function handleMouseDown(event: Event) {
		isDown = true;
		const target = event.target as HTMLElement;
		likes++; // Optimistically increment likes
		setTimeout(() => {
			particleSystem.trigger(target);
		}, 150);
	}

	function handleMouseUp() {
		isDown = false;
	}

	function handleMouseEnter() {
		isHovering = true;
	}

	function handleMouseLeave() {
		isHovering = false;
		isDown = false;
	}
</script>

<div class="flex flex-col items-center justify-center gap-2">
	<p class="text-foreground break-words text-center text-sm">{likeFormAction?.message}</p>
	<form use:enhance class="flex items-center gap-1">
		<div>{likes}</div>
		<div class="relative">
			<button
				onmousedown={handleMouseDown}
				onmouseup={handleMouseUp}
				onmouseenter={handleMouseEnter}
				onmouseleave={handleMouseLeave}
				class={cn('z-20 transform transition-transform', {
					'animate-scale-bounce rotate-12 scale-125': isHovering,
					'rotate-0 scale-90': isDown,
				})}
				type="button">❤️</button
			>
			<div class="pointer-events-none fixed inset-0">
				{#each particles as particle (particle.id)}
					<div
						class="absolute text-xs will-change-transform"
						style="transform: translate3d({particle.position.x}px, {particle.position
							.y}px, 0) scale3d({particle.scale}, {particle.scale}, 1); opacity: {particle.opacity};"
					>
						❤️
					</div>
				{/each}
			</div>
		</div>
	</form>
</div>

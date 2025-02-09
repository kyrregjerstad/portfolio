<script lang="ts">
	import { enhance } from '$app/forms';
	import { spring } from 'svelte/motion';

	type Props = {
		likes: number;
		likeFormAction: {
			likeCount: number;
			message?: string;
		} | null;
	};

	type Particle = {
		id: number;
		x: number;
		y: number;
		velocity: { x: number; y: number };
		opacity: number;
		scale: number;
	};

	let { likes, likeFormAction }: Props = $props();
	let scale = spring(1, { stiffness: 0.2, damping: 0.4 });
	let particles: Particle[] = $state([]);
	let particleId = 0;

	$effect(() => {
		if (likeFormAction) {
			likes = likeFormAction.likeCount;
		}
	});

	function createParticle(x: number, y: number) {
		return {
			id: particleId++,
			x,
			y,
			velocity: {
				x: (Math.random() - 0.5) * 2, // Random horizontal spread
				y: -Math.random() * 2 - 2, // Upward velocity
			},
			opacity: 1,
			scale: 0.5 + Math.random() * 0.5,
		};
	}

	function addParticles(event: MouseEvent) {
		const rect = (event.target as HTMLElement).getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;

		// Create 6 particles
		const newParticles = Array.from({ length: 6 }, () => createParticle(centerX, centerY));
		particles = [...particles, ...newParticles];

		// Animate particles
		const interval = setInterval(() => {
			particles = particles
				.map((p) => ({
					...p,
					x: p.x + p.velocity.x,
					y: p.y + p.velocity.y,
					opacity: p.opacity - 0.02,
					velocity: {
						...p.velocity,
						y: p.velocity.y + 0.1, // Add some gravity
					},
				}))
				.filter((p) => p.opacity > 0);

			if (particles.length === 0) {
				clearInterval(interval);
			}
		}, 16);
	}

	const handleMouseDown = (event: MouseEvent) => {
		likes++; // Optimistically increment likes
		scale.set(1.4); // Scale up
		setTimeout(() => scale.set(1), 150); // Scale back down
		addParticles(event);
	};
</script>

<div class="flex flex-col items-center justify-center gap-2">
	<p class="text-foreground break-words text-center text-sm">{likeFormAction?.message}</p>
	<form use:enhance class="flex items-center gap-1">
		<div>{likes}</div>
		<div class="relative">
			<button
				onmousedown={handleMouseDown}
				class="hover:text-primary aspect-square rounded-md px-2 transition-colors duration-200"
				style="transform: scale({$scale}); transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
				type="button">❤️</button
			>
			{#each particles as particle (particle.id)}
				<div
					class="pointer-events-none fixed text-xs"
					style="left: {particle.x}px; top: {particle.y}px; transform: scale({particle.scale}); opacity: {particle.opacity};"
				>
					❤️
				</div>
			{/each}
		</div>
	</form>
</div>

<style>
	.fixed {
		position: fixed;
		z-index: 50;
		transition: all 0.016s linear;
	}
</style>

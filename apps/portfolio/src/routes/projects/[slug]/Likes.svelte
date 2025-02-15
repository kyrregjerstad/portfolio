<script lang="ts">
	import { cn } from '@/lib/utils';
	import { cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import { HeartSFX } from './heart-sfx.svelte';
	import { Particles } from './particles.svelte';
	import { page } from '$app/state';
	import { MAX_LIKES_PER_USER } from '@/lib/config';

	type Props = {
		likes: number;
		totalLikesByUser: number;
	};

	let { likes, totalLikesByUser }: Props = $props();

	let particleSystem = $state<Particles>(new Particles({ speed: 0.75 }));
	let particles = $derived(particleSystem.getParticles() || []);
	let isHovering = $state(false);
	let isDown = $state(false);
	let heartSFX = $state(new HeartSFX());

	let isMaxCountReached = $derived(totalLikesByUser >= MAX_LIKES_PER_USER);
	let isTouchDevice = $state(false);

	$inspect('totalLikesByUser component', totalLikesByUser);
	$inspect('isMaxCountReached component', isMaxCountReached);
	$effect(() => {
		// Check if device supports touch events
		isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
		return () => {
			particleSystem.cleanup();
		};
	});

	async function handleLike() {
		totalLikesByUser++;
		const response = await fetch(`/api/like/${page.params.slug}`, {
			method: 'PUT',
		});

		console.log('response', response);

		if (!response.ok) {
			totalLikesByUser--;
			console.error(response);
			return;
		}

		const data = await response.json();

		if (data.likeCount) {
			// reconcile the likes count with the server
			likes = data.likeCount;
		}
		if (response.status === 400) {
			console.error(data);
		}
	}

	async function triggerLike(target: HTMLElement) {
		if (isMaxCountReached) {
			return;
		}

		isDown = true;
		void handleLike();

		setTimeout(() => {
			particleSystem.trigger(target);
		}, 150);

		likes++;
		heartSFX.increment(totalLikesByUser);

		// Reset states after animation
		setTimeout(() => {
			isDown = false;
			if (isTouchDevice) {
				isHovering = false;
			}
		}, 200);
	}

	function handleMouseDown(event: Event) {
		if (isTouchDevice) return; // Skip for touch devices
		rotate = randomRotate();
		void triggerLike(event.target as HTMLElement);
	}

	function handleTouchStart(event: TouchEvent) {
		event.preventDefault(); // Prevent double-firing on some devices
		isHovering = true; // Show hover state briefly on touch
		void triggerLike(event.target as HTMLElement);
	}

	function handleMouseUp() {
		if (isTouchDevice) return;
		setTimeout(() => {
			isDown = false;
		}, 200);
	}

	function handleMouseEnter() {
		if (!isTouchDevice) {
			rotate = randomRotate();
			isHovering = true;
		}
	}

	function handleMouseLeave() {
		if (!isTouchDevice) {
			isHovering = false;
			isDown = false;
		}
	}

	function handleTouchEnd() {
		setTimeout(() => {
			isHovering = false;
			isDown = false;
		}, 200);
	}

	function randomRotate() {
		return Math.random() * 45 - 22.5;
	}

	let rotate = $state(0);
</script>

<div class="flex flex-col items-center justify-center gap-2">
	<div class="select-none">{likes}</div>
	<div class="relative">
		<button
			onmousedown={handleMouseDown}
			onmouseup={handleMouseUp}
			onmouseenter={handleMouseEnter}
			onmouseleave={handleMouseLeave}
			ontouchstart={handleTouchStart}
			ontouchend={handleTouchEnd}
			class={cn(
				' z-20 transform select-none transition-transform',
				isHovering && !isMaxCountReached && `animate-scale-bounce random-rotate`,
				{
					'rotate-0 scale-90': isDown && !isMaxCountReached,
				}
			)}
			style={`--rotate: ${rotate}deg`}
			type="submit">❤️</button
		>
		<div class="pointer-events-none fixed inset-0">
			{#each particles as particle (particle.id)}
				<div
					class="absolute select-none text-xs will-change-transform"
					style="transform: translate3d({particle.position.x}px, {particle.position
						.y}px, 0) scale3d({particle.scale}, {particle.scale}, 1); opacity: {particle.opacity};"
				>
					❤️
				</div>
			{/each}
		</div>

		{#if isMaxCountReached}
			<span
				in:fly={{
					duration: 800,
					y: 50,
					easing: cubicOut,
				}}
				class="text-muted-foreground absolute -right-7 top-[3px] text-xs">max</span
			>
		{/if}
	</div>
</div>

<style>
	.random-rotate {
		transform: rotate(var(--rotate)) scale(1.5);
	}
</style>

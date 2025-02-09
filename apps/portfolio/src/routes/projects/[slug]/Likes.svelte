<script lang="ts">
	import { cn } from '@/lib/utils';
	import { cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import { HeartSFX } from './heart-sfx.svelte';
	import { Particles } from './particles.svelte';
	import { page } from '$app/state';

	type Props = {
		likes: number;
		likeFormAction: {
			likeCount: number;
			message?: string;
		} | null;
		userHasLikedMaxTimes: boolean;
	};

	let { likes, userHasLikedMaxTimes }: Props = $props();

	let particleSystem = $state<Particles>(new Particles({ speed: 0.75 }));
	let particles = $derived(particleSystem.getParticles() || []);
	let isHovering = $state(false);
	let isDown = $state(false);
	let heartSFX = $state(new HeartSFX());
	let isMaxCountReached = $derived(userHasLikedMaxTimes || heartSFX.getMaxCountReached());
	let isTouchDevice = $state(false);

	$effect(() => {
		// Check if device supports touch events
		isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
		return () => {
			particleSystem.cleanup();
		};
	});

	async function handleLike() {
		const response = await fetch(`/api/like/${page.params.slug}`, {
			method: 'PUT',
		});

		console.log('response', response);

		if (!response.ok) {
			// likes++;
			console.error(response);
			return;
		}

		if (response.status === 400) {
			const data = await response.json();
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
		heartSFX.increment();

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
				'z-20 transform select-none transition-transform',
				{
					'animate-scale-bounce rotate-12 scale-110': isHovering && !isMaxCountReached,
				},
				{
					'rotate-0 scale-90': isDown && !isMaxCountReached,
				}
			)}
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

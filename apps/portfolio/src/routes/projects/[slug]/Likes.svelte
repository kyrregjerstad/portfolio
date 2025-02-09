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

	$effect(() => {
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

	async function handleMouseDown(event: Event) {
		isDown = true;
		const target = event.target as HTMLElement;

		if (isMaxCountReached) {
			return;
		}

		void handleLike();

		setTimeout(() => {
			particleSystem.trigger(target);
		}, 150); // short delay to time the animation better

		likes++; // Optimistically increment likes
		heartSFX.increment();
	}

	function handleMouseUp() {
		setTimeout(() => {
			isDown = false;
		}, 200); // short delay to time the animation better
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
	<div class="select-none">{likes}</div>
	<div class="relative">
		<button
			onmousedown={handleMouseDown}
			onmouseup={handleMouseUp}
			onmouseenter={handleMouseEnter}
			onmouseleave={handleMouseLeave}
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

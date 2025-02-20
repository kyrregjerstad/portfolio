<script lang="ts">
	import { page } from '$app/state';
	import { MAX_LIKES_PER_USER } from '@/lib/config';
	import { cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import HeartButton from './HeartButton.svelte';
	import { Particles } from './particles.svelte';
	import { HeartIcon } from 'lucide-svelte';

	let likes = $state(0);
	let totalLikesByUser = $state(0);
	let isLoading = $state(true);

	let particleSystem = $state<Particles>(new Particles({ speed: 0.75 }));
	let particles = $derived(particleSystem.getParticles() || []);
	let isMaxCountReached = $derived(totalLikesByUser >= MAX_LIKES_PER_USER);

	$effect(() => {
		return () => {
			particleSystem.cleanup();
		};
	});

	async function fetchLikes() {
		try {
			const response = await fetch(`/api/like/${page.params.slug}`);
			if (!response.ok) throw new Error('Failed to fetch likes');

			const data = await response.json();
			likes = data.likes;
			totalLikesByUser = data.totalLikesByUser;
		} catch (error) {
			console.error('Error fetching likes:', error);
		} finally {
			isLoading = false;
		}
	}

	$effect(() => {
		void fetchLikes();
	});

	async function handleLike() {
		totalLikesByUser++;
		const response = await fetch(`/api/like/${page.params.slug}`, {
			method: 'PUT',
		});

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

	async function triggerLike(target: HTMLButtonElement) {
		if (totalLikesByUser + 1 === MAX_LIKES_PER_USER) {
			particleSystem.triggerWinner(target);
		}

		if (isMaxCountReached) {
			return;
		}

		void handleLike();

		setTimeout(() => {
			particleSystem.trigger(target);
		}, 150);

		likes++;
	}
</script>

<div class="flex flex-col items-center justify-center gap-2">
	<div class="select-none">
		{#if isLoading}
			<span class="text-muted-foreground">...</span>
		{:else}
			{likes}
		{/if}
	</div>
	<div class="relative">
		<HeartButton
			{isMaxCountReached}
			{totalLikesByUser}
			projectTitle={page.data.project.title}
			onmousedown={({ currentTarget }) => triggerLike(currentTarget)}
			ontouchstart={({ currentTarget }) => triggerLike(currentTarget)}
			disabled={isLoading}
		/>
		<div class="pointer-events-none fixed inset-0">
			{#each particles as particle (particle.id)}
				<div
					class="absolute select-none text-xs will-change-transform"
					style="transform: translate3d({particle.position.x}px, {particle.position
						.y}px, 0) scale3d({particle.scale}, {particle.scale}, 1); opacity: {particle.opacity};"
				>
					<HeartIcon class="size-4" />
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
				class="text-muted-foreground absolute -right-7 top-[3px] select-none text-xs">max</span
			>
		{/if}
	</div>
</div>

<script lang="ts">
	import NumberFlow from '@number-flow/svelte';
	import { MAX_LIKES_PER_USER } from '@/lib/config';
	import { cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import { Particles } from './projects/[slug]/particles.svelte';
	import HeartButton from './projects/[slug]/HeartButton.svelte';
	import { HeartIcon } from '@lucide/svelte';

	type Props = {
		initialLikes: number;
		slug: string;
	};

	let { initialLikes, slug }: Props = $props();

	let count = $state(initialLikes / 1.5); // to have some intro animation
	let totalLikesByUser = $state(0);
	let isLoading = $state(true);
	let isMaxCountReached = $derived(totalLikesByUser >= MAX_LIKES_PER_USER);
	let particleSystem = $state<Particles>(new Particles({ speed: 0.75 }));

	$effect(() => {
		void fetchLikes();

		return () => {
			particleSystem.cleanup();
		};
	});

	async function fetchLikes() {
		try {
			const url = slug === '/' ? '/api/likes' : `/api/like/${slug}`;
			const data = await fetch(url);

			if (!data.ok) throw new Error('Failed to fetch likes');

			const totalData = await data.json();

			count = totalData.likes;
			totalLikesByUser = totalData.totalLikesByUser;
		} catch (error) {
			console.error('Error fetching likes:', error);
		} finally {
			isLoading = false;
		}
	}

	async function handleLike() {
		totalLikesByUser++;
		const url = slug === '/' ? '/api/like/hero' : `/api/like/${slug}`;
		const response = await fetch(url, {
			method: 'PUT',
		});

		if (!response.ok) {
			totalLikesByUser--;
			console.error(response);
			return;
		}

		const data = await response.json();

		if (data.success) {
			const url = slug === '/' ? '/api/likes' : `/api/like/${slug}`;
			// Refetch total likes after successful like
			const totalResponse = await fetch(url);
			if (totalResponse.ok) {
				const totalData = await totalResponse.json();
				count = totalData.likes;
			}
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
	}

	function getRandomColor() {
		return `hsl(${Math.random() * 360}, 100%, 50%)`;
	}
</script>

<div class="relative flex w-fit gap-2">
	<HeartButton
		{isMaxCountReached}
		{totalLikesByUser}
		projectTitle="Hero"
		onmousedown={({ currentTarget }) => triggerLike(currentTarget)}
		ontouchstart={({ currentTarget }) => triggerLike(currentTarget)}
		disabled={isLoading}
	/>
	<div class="select-none">
		<NumberFlow value={Math.round(count)} />
	</div>

	<div class="pointer-events-none fixed inset-0">
		{#each particleSystem.getParticles() as particle (particle.id)}
			<div
				class="absolute select-none text-xs will-change-transform"
				style="transform: translate3d({particle.position.x}px, {particle.position
					.y}px, 0) scale3d({particle.scale}, {particle.scale}, 1); opacity: {particle.opacity};"
			>
				<HeartIcon
					fill={isMaxCountReached ? getRandomColor() : 'currentColor'}
					stroke="transparent"
					class="size-4 stroke-transparent"
				/>
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
			class="text-muted-foreground absolute -right-8 top-[3px] select-none text-xs">max</span
		>
	{/if}
</div>

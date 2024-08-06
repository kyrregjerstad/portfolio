<script lang="ts">
	import { cubicInOut } from 'svelte/easing';
	import { draw } from 'svelte/transition';

	type Props = {
		firstVisit: boolean;
	};

	let { firstVisit }: Props = $props();

	let mounted = $state(false);

	const commands = 'M0,0 L100,0 L100,100 L0,100 z';

	$effect(() => {
		mounted = true;
	});
</script>

{#if mounted}
	<svg
		class="stroke-foreground pointer-events-none fixed inset-0 z-50 h-[calc(100dvh_-_2.5rem)] w-[calc(100vw_-_2.5rem)] translate-x-[1.25rem] translate-y-[1.25rem] sm:h-[calc(100dvh_-_5rem)] sm:w-[calc(100vw_-_5rem)] sm:translate-x-[2.5rem] sm:translate-y-[2.5rem]"
		viewBox="0 0 100 100"
		preserveAspectRatio="none"
	>
		<path
			transition:draw={{ duration: 2500, delay: firstVisit ? 1500 : 0, easing: cubicInOut }}
			d={commands}
			fill="none"
			stroke-width="0.1px"
		/>
	</svg>
{/if}

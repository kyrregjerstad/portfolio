<script>
	import { cubicInOut } from 'svelte/easing';
	import { draw } from 'svelte/transition';

	let mounted = $state(false);

	const commands = 'M0,0 L100,0 L100,100 L0,100 z';

	$effect(() => {
		mounted = true;
	});
</script>

{#if mounted}
	<svg
		class="stroke-foreground pointer-events-none fixed inset-0 z-50 h-[calc(100dvh_-_5rem)] w-[calc(100vw_-_5rem)] translate-x-[2.5rem] translate-y-[2.5rem]"
		viewBox="0 0 100 100"
		preserveAspectRatio="none"
	>
		<path transition:draw={{ duration: 1800, easing: cubicInOut }} d={commands} fill="none" stroke-width="0.1px" />
	</svg>
{/if}

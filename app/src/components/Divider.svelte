<script lang="ts">
	import { cn } from '@/lib/utils/cn';
	import { cubicInOut, cubicOut } from 'svelte/easing';
	import { draw } from 'svelte/transition';

	type Props = {
		class?: string;
		duration?: number;
		delay?: number;
	};
	const { class: className, duration = 2000, delay = 0 }: Props = $props();

	let mounted = $state(false);

	$effect(() => {
		mounted = true;
	});
</script>

<!-- <hr class={cn('border-foreground my-6 opacity-50 sm:my-12', className)} /> -->
<div class="my-12 h-1">
	{#if mounted}
		<svg class="stroke-foreground text-foreground opactity-50 h-1 w-full">
			<line
				transition:draw={{ duration, delay, easing: cubicOut }}
				x1="0"
				y1="0"
				x2="100%"
				y2="0"
				stroke-width="1"
				stroke="currentColor"
			/>
		</svg>
	{/if}
</div>

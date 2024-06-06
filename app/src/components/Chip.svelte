<script lang="ts">
	import { cn } from '@/lib/utils/cn';
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		class?: string;
	};

	const { children, class: className }: Props = $props();
</script>

<span
	class={cn(
		'bg-foreground/20 hover:bg-foreground/30 h-fit w-fit rounded-sm border border-opacity-10 px-4 py-2 text-xs transition-colors sm:text-sm',
		className
	)}
>
	{@render children()}
</span>

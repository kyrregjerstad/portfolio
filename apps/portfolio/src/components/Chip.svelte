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
		'bg-foreground/20 hover:bg-foreground/30 border-foreground/20 h-fit w-fit rounded-sm border px-2 py-1 text-xs transition-colors sm:px-4 sm:py-2 sm:text-sm',
		className
	)}
>
	{@render children()}
</span>

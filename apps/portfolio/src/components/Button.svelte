<script lang="ts">
	import { cn } from '@/lib/utils/cn';
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		onclick?: () => void;
		class?: string;
	};

	const { children, class: className, onclick }: Props = $props();
</script>

<button
	class={cn(
		'bg-foreground/20 hover:bg-foreground/30 flex h-fit w-fit items-center justify-center gap-2 rounded-sm border border-opacity-10 px-4 py-2 text-sm transition-colors hover:border-opacity-50 hover:underline',
		className
	)}
	{onclick}
>
	{@render children()}
</button>

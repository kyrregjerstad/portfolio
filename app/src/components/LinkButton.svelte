<script lang="ts">
	import { cn } from '@/lib/utils/cn';
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		href: string;
		class?: string;
	};

	const { children, href, class: className }: Props = $props();
</script>

<a
	{href}
	target="_blank"
	class={cn(
		'bg-foreground/20 hover:bg-foreground/30 flex h-fit w-fit items-center justify-center gap-2 rounded-sm border border-opacity-10 px-2 py-1 text-xs transition-colors hover:border-opacity-50 hover:underline sm:px-4 sm:py-2 sm:text-sm',
		className
	)}
>
	{@render children()}
</a>

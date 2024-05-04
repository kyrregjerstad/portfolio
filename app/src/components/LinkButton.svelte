<script lang="ts">
	import { cn } from "@/lib/utils/cn";
import type { Snippet } from "svelte";

  type Props = {
    children: Snippet;
    href: string;
    class?: string;
  };

	const { children, href, class: className }: Props = $props();
</script>

<a {href} class={cn('bg-foreground/20 flex items-center justify-center gap-2 h-fit w-fit rounded-sm px-4 py-2 text-sm hover:bg-foreground/30 border border-opacity-10 hover:border-opacity-50 transition-colors hover:underline', className)}> 
{@render children()}
</a>

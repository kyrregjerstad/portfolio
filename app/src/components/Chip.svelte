<script lang="ts">
	import { cn } from "@/lib/utils/cn";
import type { Snippet } from "svelte";

  type Props = {
    children: Snippet;
    class?: string;
  };

	const { children, class: className }: Props = $props();
</script>

<span class={cn('bg-foreground/20 border border-opacity-10 h-fit w-fit rounded-sm px-4 py-2 text-sm hover:bg-foreground/30 transition-colors', className)}> 
{@render children()}
</span>

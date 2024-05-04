<script>
	import { ChevronLeftIcon } from 'lucide-svelte';

	const { children } = $props();
</script>

<div class="flex h-full w-full flex-col items-center">
	<!-- <a href="/">
    <ChevronLeftIcon class="size-10" />
    <span class="sr-only">back home</span>
  </a> -->
	<div class="flex h-full w-full max-w-[900px] flex-col">
		{@render children()}
	</div>
</div>

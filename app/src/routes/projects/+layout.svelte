<script>
	import { ChevronLeftIcon } from 'lucide-svelte';

	const { children } = $props();
</script>

<div class="flex h-full w-full flex-col items-center">
	<!-- <a href="/">
    <ChevronLeftIcon class="size-10" />
    <span class="sr-only">back home</span>
  </a> -->
	<div class="flex h-full w-full max-w-5xl flex-col">
		{@render children()}
	</div>
</div>

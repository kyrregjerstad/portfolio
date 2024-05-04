<script>
  import { ChevronLeftIcon } from 'lucide-svelte';

	const { children } = $props();
</script>

<div>
  <!-- <a href="/">
    <ChevronLeftIcon class="size-10" />
    <span class="sr-only">back home</span>
  </a> -->

  {@render children()}
</div>


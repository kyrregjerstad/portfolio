<script>
	import Border from './Border.svelte';

	import '@/app.pcss';
	const { children } = $props();

</script>


<!-- we could make the border animate in, wrapping the screen -->
<div class="border-background h-dvh border-[2.5rem] relative">
	<Border />
	<main class="border-foreground h-full overflow-auto p-10">
		{@render children()}
	</main>
</div>

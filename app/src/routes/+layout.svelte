<script>
	import '@/app.pcss';
	import Border from './Border.svelte';

	const { children } = $props();

</script>



<div class="border-background h-dvh border-[2.5rem] relative">
	<Border />
	<main class="border-foreground h-full overflow-auto p-10 no-scrollbar">
		{@render children()}
	</main>
</div>

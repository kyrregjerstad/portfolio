<script>
	import '@/app.pcss';
	import Border from './Border.svelte';

	const { children } = $props();
</script>

<div class="border-background relative h-dvh border-[2.5rem]">
	<Border />
	<main class="border-foreground no-scrollbar h-full min-h-[calc(100dvh_-_5rem)] overflow-auto p-10">
		<div class="mx-auto max-w-5xl">
			{@render children()}
		</div>
	</main>
</div>

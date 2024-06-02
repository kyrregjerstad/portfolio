<script>
	import { browser } from '$app/environment';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import '@/app.pcss';
	import Analytics from '@/components/Analytics.svelte';
	import posthog from 'posthog-js';
	import { Toaster } from 'svelte-sonner';
	import Border from './Border.svelte';

	if (browser) {
		beforeNavigate(() => posthog.capture('$pageleave'));
		afterNavigate(() => posthog.capture('$pageview'));
	}

	const { children } = $props();
</script>

<Analytics />
<div class="border-background relative h-dvh border-[2.5rem]">
	<Border />

	<main class="border-foreground no-scrollbar flex h-full min-h-[calc(100dvh_-_5rem)] flex-col overflow-auto p-10">
		<div class="mx-auto flex max-w-5xl flex-col">
			{@render children()}
		</div>
	</main>
	<Toaster />
</div>

<script>
	import '@/app.pcss';
	import Border from './Border.svelte';
	import { Toaster } from 'svelte-sonner';
	import posthog from 'posthog-js';
	import { browser } from '$app/environment';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import ThemeSwitcher from '@/components/ThemeSwitcher.svelte';

	if (browser) {
		beforeNavigate(() => posthog.capture('$pageleave'));
		afterNavigate(() => posthog.capture('$pageview'));
	}

	const { children } = $props();
</script>

<div class="border-background relative h-dvh border-[2.5rem]">
	<Border />

	<main class="border-foreground no-scrollbar flex h-full min-h-[calc(100dvh_-_5rem)] flex-col overflow-auto p-10">
		<div class="mx-auto flex max-w-5xl flex-col">
			{@render children()}
		</div>
	</main>
	<Toaster />
</div>

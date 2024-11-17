<script lang="ts">
	import '@/app.pcss';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Toaster } from 'svelte-sonner';
	import posthog from 'posthog-js';
	import Border from './Border.svelte';
	import Analytics from '@/components/Analytics.svelte';
	import Footer from '@/components/Footer.svelte';
	import Socials from '@/components/Socials.svelte';
	import type { LayoutData, LayoutServerData } from './$types';
	import type { Snippet } from 'svelte';
	import SEO from '@/components/SEO.svelte';

	if (browser) {
		beforeNavigate(() => posthog.capture('$pageleave'));
		afterNavigate(() => posthog.capture('$pageview'));
	}

	type Props = {
		children: Snippet;
		data: LayoutServerData;
	};
	const { children, data }: Props = $props();
</script>

<Analytics />
<SEO {...data.SEO} />
<Socials />
<div class="border-background relative h-dvh overflow-hidden border-[1.25rem] sm:border-[2.5rem]">
	<Border firstVisit={data.firstVisit} />
	<main class="border-foreground no-scrollbar flex h-full min-h-[calc(100dvh_-_5rem)] flex-col overflow-auto">
		<div class="mx-auto flex w-full flex-col p-4">
			{@render children()}
		</div>
		<Footer />
	</main>
	<Toaster />
</div>

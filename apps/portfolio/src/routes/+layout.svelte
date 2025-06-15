<script lang="ts">
	import { browser } from '$app/environment';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import '@/app.css';
	import Analytics from '@/components/Analytics.svelte';
	import SEO from '@/components/SEO.svelte';
	import Socials from '@/components/Socials.svelte';
	import posthog from 'posthog-js';
	import type { Snippet } from 'svelte';
	import { Toaster } from 'svelte-sonner';
	import type { LayoutServerData } from './$types';
	import Border from './Border.svelte';
	import PageTransition from './PageTransition.svelte';
	import CursorTracker from '@/components/CursorTracker.svelte';

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
<PageTransition />
<CursorTracker />
<div class="relative overflow-hidden">
	<Border>
		<main class="no-scrollbar relative flex flex-col p-10 sm:p-16">
			{@render children()}
		</main>
	</Border>
	<Toaster />
</div>

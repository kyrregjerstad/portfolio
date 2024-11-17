<script lang="ts">
	import '@/app.pcss';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Toaster } from 'svelte-sonner';
	import posthog from 'posthog-js';
	import Analytics from '@/components/Analytics.svelte';
	import Footer from '@/components/Footer.svelte';
	import Socials from '@/components/Socials.svelte';
	import type { LayoutServerData } from './$types';
	import type { Snippet } from 'svelte';
	import SEO from '@/components/SEO.svelte';
	import Border from './Border.svelte';

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
<div class="relative overflow-hidden">
	<Border>
		<main class=" no-scrollbar relative flex flex-col p-16">
			{@render children()}
		</main>
	</Border>
	<Toaster />
</div>

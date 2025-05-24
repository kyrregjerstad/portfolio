<script lang="ts">
	import { page } from '$app/state';
	import type { SEO } from '$lib/types';

	const { title, description, keywords, author, openGraph, twitter }: SEO = $props();

	// Don't render default meta tags for blog posts since they have their own complete SEO
	let isBlogPost = $derived(page.url.pathname.startsWith('/blog/') && page.url.pathname !== '/blog');
</script>

<svelte:head>
	{#if !isBlogPost}
		<title>{title}</title>
		<meta name="description" content={description} />
		<meta name="keywords" content={keywords.join(',')} />
		<meta name="author" content={author} />
	{/if}

	<meta name="robots" content="index, follow" />

	{#if !isBlogPost}
		<!-- Open Graph / Facebook -->
		<meta property="og:type" content="website" />
		<meta property="og:url" content={openGraph.url} />
		<meta property="og:title" content={openGraph.title} />
		<meta property="og:description" content={openGraph.description} />
		<meta property="og:image" content={openGraph.image} />

		<!-- Twitter -->
		<meta property="twitter:card" content="summary_large_image" />
		<meta property="twitter:url" content={twitter.url} />
		<meta property="twitter:title" content={twitter.title} />
		<meta property="twitter:description" content={twitter.description} />
		<meta property="twitter:image" content={twitter.image} />
		<meta property="twitter:card" content={twitter.card} />
		<meta property="twitter:site" content={twitter.site} />
		<meta property="twitter:creator" content={twitter.creator} />
	{/if}
</svelte:head>

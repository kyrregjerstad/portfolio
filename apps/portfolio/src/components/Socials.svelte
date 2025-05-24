<script lang="ts">
	import { page } from '$app/state';

	// Don't render default OG tags for blog posts since they have their own
	// Use URL path instead of route ID for more reliable detection
	let isBlogPost = $derived(page.url.pathname.startsWith('/blog/') && page.url.pathname !== '/blog');
</script>

{#if !isBlogPost}
	<meta property="og:site_name" content="Kyrre Gjerstad" />
	<meta property="og:url" content="https://kyrre.dev" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Kyrre Gjerstad - Full-stack developer" />
	<meta property="og:image" content="https://kyrre.dev/images/og-kyrre-gjerstad.jpg" />
	<meta
		property="og:description"
		content="Portfolio of Kyrre Gjerstad, a full-stack developer specializing in NextJS and SvelteKit."
	/>
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@kyrregjerstad" />
	<meta name="twitter:creator" content="@kyrregjerstad" />
	<meta name="twitter:title" content="Kyrre Gjerstad - Full-stack developer" />
	<meta
		name="twitter:description"
		content="Portfolio of Kyrre Gjerstad, a full-stack developer specializing in NextJS and SvelteKit."
	/>
	<meta name="twitter:image" content="https://kyrre.dev/images/og-kyrre-gjerstad.jpg" />
{/if}

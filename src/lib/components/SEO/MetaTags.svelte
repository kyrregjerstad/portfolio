<script lang="ts">
	import * as config from "$config";
</script>

<svelte:head>
	<meta property="og:site_name" content={config.title} />
	<meta property="og:locale" content={config.language} />
	<meta property="og:url" content={config.url} />
	<meta property="og:type" content={""} />
	<meta property="og:description" content={config.metaDescription} />
	<meta name="description" content={config.metaDescription} />
	<link rel="canonical" href={config.url} />
	<meta property="og:title" content={config.title} />
	<meta property="og:image" content={config.image} />
</svelte:head>

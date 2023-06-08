<script>
	import * as config from "../../config";
</script>

<svelte:head>
	<meta property="twitter:image" content={config.img} />
	<meta property="twitter:title" content={config.title} />
	<meta property="twitter:description" content={config.description} />

	<meta property="og:title" content={config.title} />
	<meta property="og:description" content={config.description} />
	<meta property="og:image" content={config.img} />
	<meta property="og:url" content={config.url} />
</svelte:head>

<script lang="ts">
	import { formatDate } from '@/lib/utils.js';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.meta.title}</title>
</svelte:head>

<h1>{data.meta.title}</h1>

<article class="prose">
	<hgroup>
		<h2>{data.meta.title}</h2>
		<p>{formatDate(data.meta.publishedAt)}</p>
	</hgroup>
	<div>
		<svelte:component this={data.content} />
	</div>
</article>

<script lang="ts">
	import { formatDate } from '@/lib/utils.js';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.meta.title}</title>
</svelte:head>

<article class="prose mx-auto text-pretty">
	<hgroup>
		<p>{formatDate(data.meta.publishedAt)}</p>
	</hgroup>
	<div>
		<svelte:component this={data.content} />
	</div>
</article>

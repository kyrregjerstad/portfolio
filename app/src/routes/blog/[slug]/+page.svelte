<script lang="ts">
	import Divider from '@/components/Divider.svelte';
	import Comments from '@/components/Comments.svelte';
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
		<data.content />
		<address>
			<p>{data.meta.author}</p>
		</address>
	</div>
</article>
<Divider />
<Comments commentForm={data.commentForm} comments={data.comments} isLoggedIn={data.isLoggedIn} />

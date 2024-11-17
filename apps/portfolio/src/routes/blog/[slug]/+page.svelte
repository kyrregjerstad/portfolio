<script lang="ts">
	import Divider from '@/components/Divider.svelte';
	import Comments from '@/components/Comments.svelte';
	import { formatDate } from '@/lib/utils.js';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.meta.title}</title>
</svelte:head>

<article class="prose prose-hr:border-t prose-hr:border-muted-foreground mx-auto text-pretty">
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
<Comments commentForm={data.commentForm} isLoggedIn={data.isLoggedIn} postId={data.meta.id} />

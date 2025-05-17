<script lang="ts">
	import Comments from '@/components/Comments.svelte';
	import Divider from '@/components/Divider.svelte';
	import { formatDate } from '@/lib/utils.js';
	import { ArrowLeft } from '@lucide/svelte';
	let { data } = $props();
</script>

<svelte:head>
	<title>{data.meta.title}</title>
</svelte:head>

<div class="relative flex flex-col gap-8">
	<article class="prose prose-hr:border-t prose-hr:border-muted-foreground mx-auto max-w-full text-pretty sm:max-w-4xl">
		<header>
			<h1>{data.meta.title}</h1>
			<p>
				<time datetime={data.meta.publishedAt}>{formatDate(data.meta.publishedAt)}</time>
				<span>by</span>
				<a href="/about/kyrregjerstad" rel="author">{data.meta.author}</a>
			</p>
		</header>
		<div>
			<data.content />
			<address>
				<p>{data.meta.author}</p>
			</address>
		</div>
		<a href="/blog" class="mb-4 flex items-center gap-2 text-sm">
			<ArrowLeft />
			Back to all posts
		</a>
	</article>
</div>
<Divider />
<Comments commentForm={data.commentForm} isLoggedIn={data.isLoggedIn} postId={data.meta.id} />

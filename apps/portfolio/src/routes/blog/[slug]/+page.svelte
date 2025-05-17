<script lang="ts">
	import Comments from '@/components/Comments.svelte';
	import Divider from '@/components/Divider.svelte';
	import { formatDate } from '@/lib/utils.js';
	import { ArrowLeft } from '@lucide/svelte';
	let { data } = $props();

	const canonicalUrl = `https://kyrre.dev/blog/${data.meta.slug}`;
	const pageTitle = data.meta.seoTitle || data.meta.title;
	const description =
		data.meta.seoDescription || data.meta.description || `Read ${data.meta.title} by ${data.meta.author}`;
	const keywords = data.meta.seoKeywords || data.meta.categories;
	const ogImage = data.meta.ogImage || 'https://kyrre.dev/images/og-kyrre-gjerstad-blog.jpg';
</script>

<svelte:head>
	<title>{pageTitle} | Kyrre Gjerstad</title>
	<meta name="description" content={description} />
	<meta name="keywords" content={keywords.join(', ')} />
	<meta name="author" content={data.meta.author} />
	<link rel="canonical" href={canonicalUrl} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="article" />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={ogImage} />
	<meta property="article:published_time" content={data.meta.publishedAt} />
	<meta property="article:author" content={data.meta.author} />
	{#each data.meta.categories as category}
		<meta property="article:tag" content={category} />
	{/each}

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content={canonicalUrl} />
	<meta name="twitter:title" content={pageTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImage} />
</svelte:head>

<div class="relative flex flex-col gap-8">
	<article class="prose prose-hr:border-t prose-hr:border-muted-foreground mx-auto max-w-full text-pretty sm:max-w-4xl">
		<header>
			<h1 class="text-pretty">{data.meta.title}</h1>
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
<!-- <Comments commentForm={data.commentForm} isLoggedIn={data.isLoggedIn} postId={data.meta.id} /> -->

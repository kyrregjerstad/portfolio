<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Blog</title>
</svelte:head>

<section class="prose min-h-dvh p-4">
	<h1>Blog Posts</h1>
	<ul class="list-disc pl-4">
		{#each data.posts as post}
			<li class="">
				<a class="hover:underline" href={`/blog/${post.slug}`}>{post.title}</a>
			</li>
		{/each}
	</ul>
</section>

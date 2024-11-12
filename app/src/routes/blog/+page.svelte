<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Blog</title>
</svelte:head>

<ul>
	{#each data.posts as post}
		<li>
			<a href={`/blog/${post.slug}`}>{post.title}</a>
		</li>
	{/each}
</ul>

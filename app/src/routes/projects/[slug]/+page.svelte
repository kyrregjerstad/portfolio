<script lang="ts">
	const { data } = $props();
	const { title, linkTitle, description, gitHubLink, href, images, keyFeatures } = data.project;
</script>

<section class="prose">
	<h1>
		{title}
	</h1>

	<p>
		{description}
	</p>

	{#if keyFeatures}
		<h2>Key Features</h2>

		<ul>
			{#each keyFeatures as keyFeature}
				<li>
					{keyFeature}
				</li>
			{/each}
		</ul>
	{/if}

	{#if images}
		{#each images as image}
			<img src={image.asset.url} alt={title} />
		{/each}
	{/if}

	{#if gitHubLink}
		<a href={gitHubLink} target="_blank" rel="noopener noreferrer"> GitHub </a>
	{/if}

	{#if href}
		<a {href} target="_blank" rel="noopener noreferrer">
			{linkTitle}
		</a>
	{/if}
</section>

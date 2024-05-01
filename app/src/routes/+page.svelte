<script>
	const { data } = $props();
	const { projects, title, heading, description } = data.page;
</script>

<div class="prose">
	<h1>{heading}</h1>
	<p>{description}</p>
</div>
<h2 class="pb-4 pt-8 text-2xl font-bold">Projects</h2>
<ul class="flex flex-col gap-2 sm:gap-1">
	{#each projects as project}
		<li class="group inline w-fit transition-transform hover:translate-x-2 hover:font-bold hover:italic">
			<span class="group-hover:hidden">&bull;</span>
			<span class="hidden group-hover:inline-block">&raquo;</span>
			<a href="projects/{project.slug}">
				{project.title}
			</a>
		</li>
	{/each}
</ul>

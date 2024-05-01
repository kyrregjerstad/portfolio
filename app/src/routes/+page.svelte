<script>
	const { data } = $props();
</script>

<h1 class="text-3xl font-bold underline">Hello world!</h1>
<ul class="ml-3 list-disc">
	{#each data.projects as project}
		<li class="transition-transform hover:translate-x-2 hover:font-bold hover:italic">
			<a href="projects/{project.slug}">
				{project.title}
			</a>
		</li>
	{/each}
</ul>
<div class="prose">
	<p>
		Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat iste enim tenetur molestiae nostrum a minus laborum
		incidunt accusantium, sint tempore officia dolore, optio ipsum quod eaque modi maiores error! Lorem ipsum dolor sit
		amet consectetur adipisicing elit. Quaerat iste enim tenetur molestiae nostrum a minus laborum incidunt accusantium,
		sint tempore officia dolore, optio ipsum quod eaque modi maiores error! Lorem ipsum dolor sit amet consectetur
		adipisicing elit. Quaerat iste enim tenetur molestiae nostrum a minus laborum incidunt accusantium, sint tempore
		officia dolore, optio ipsum quod eaque modi maiores error! Lorem ipsum dolor sit amet consectetur adipisicing elit.
		Quaerat iste enim tenetur molestiae nostrum a minus laborum incidunt accusantium, sint tempore officia dolore, optio
		ipsum quod eaque modi maiores error!
	</p>
</div>

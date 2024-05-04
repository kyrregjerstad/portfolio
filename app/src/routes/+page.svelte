<script>
	import ContactForm from '@/components/ContactForm.svelte';

	const { data } = $props();

	const { contactForm } = data;
	const { projects, title, heading, description } = data.page;
</script>

<div class="prose max-w-[800px]">
	<h1>{heading}</h1>
	<p>{description}</p>
</div>
<h2 class="pb-4 pt-8 text-2xl font-bold">Projects</h2>
<ul class="flex flex-col gap-2 sm:gap-1">
	{#each projects as project}
		<li
			class="group inline w-fit transition-transform hover:translate-x-2 hover:font-bold hover:italic hover:text-teal-500"
		>
			<span class="group-hover:hidden">&bull;</span>
			<span class="hidden group-hover:inline-block">&raquo;</span>
			<a href="projects/{project.slug}">
				{project.title}
			</a>
		</li>
	{/each}
</ul>
<section class="py-8">
	<ContactForm {contactForm} />
</section>

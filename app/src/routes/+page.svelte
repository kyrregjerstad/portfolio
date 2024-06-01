<script>
	import ContactForm from '@/components/ContactForm.svelte';
	import Divider from '@/components/Divider.svelte';
	import ThemeSwitcher from '@/components/ThemeSwitcher.svelte';

	const { data } = $props();

	const { contactForm } = data;
	const { projects, heading, description } = data.page;
</script>

<ThemeSwitcher class="self-end" darkMode={data.darkMode} />

<div>
	<h1 class="mb-7 text-pretty break-words text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">{heading}</h1>
	<p class="prose w-full max-w-4xl text-justify">{description}</p>
</div>
<Divider />
<h2 class="pb-4 text-3xl font-bold">Projects</h2>
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
<Divider />
<section>
	<ContactForm {contactForm} />
</section>

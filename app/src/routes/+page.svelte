<script>
	import ContactForm from '@/components/ContactForm.svelte';
	import Divider from '@/components/Divider.svelte';
	import ThemeSwitcher from '@/components/ThemeSwitcher.svelte';
	import PortableText from '@/lib/portableText/PortableText.svelte';

	const { data } = $props();

	const { contactForm } = data;
	const { projects, heading, description } = data.page;
</script>

<div class="flex w-full">
	<h1 class="flex-1 text-pretty break-words pb-4 text-3xl font-bold tracking-tight sm:pb-6 sm:text-4xl md:text-5xl">
		{heading}
	</h1>
	<ThemeSwitcher class="justify-end self-start" darkMode={data.darkMode} />
</div>
<PortableText portableText={description} class="prose max-w-4xl text-pretty" />
<Divider />
<h2 class="pb-4 text-3xl font-bold">Projects</h2>
<ul class="flex flex-col gap-2 sm:gap-1">
	{#each projects as project}
		<li
			class="hover:text-accent-foreground group inline w-fit transition-transform hover:translate-x-2 hover:font-bold hover:italic"
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
	<h2 class="pb-4 text-3xl font-bold">Contact</h2>
	<ContactForm {contactForm} />
</section>

<script lang="ts">
	import Blob from './Blob.svelte';

	import ContactForm from '@/components/ContactForm.svelte';
	import Divider from '@/components/Divider.svelte';

	const { data } = $props();

	const { contactForm } = data;
	const { projects, heading, description } = data.page;
</script>

<div class=" sticky top-0 mx-auto w-full max-w-7xl">
	<div class="relative flex min-h-[calc(100dvh_-_8rem)] w-full flex-col justify-center">
		<div class="hero-text text-justify">
			<h1
				class="mb-2 text-pretty break-words text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl"
			>
				Hei, I'm Kyrre!
			</h1>
			<h2 class="mb-12 text-lg lg:text-xl">
				A fullstack typescript developer specialized in
				<strong> SvelteKit </strong>
				and
				<strong> NextJS. </strong>
			</h2>
			<p class="prose leading-loose">
				As a frontend-focused fullstack developer from Norway, I am passionate about creating visually appealing and
				functional products that offer a great user experience. I specialize in NextJS and SvelteKit with TypeScript and
				Tailwind. Whether building complex web applications or optimizing existing platforms, I am committed to
				delivering clean, efficient code. Explore my portfolio below to see a range of professional and academic
				projects I've worked on.
			</p>
		</div>
		<Blob />
	</div>
</div>
<!-- TODO: make top sticky and have the divider be the scroll point over the hero -->
<div class="bg-background/50 relative z-10 w-full backdrop-blur-sm">
	<div
		class="from-background/50 gradient-blur absolute -top-96 h-96 w-full bg-gradient-to-t to-transparent backdrop-blur-lg"
	></div>
	<div class="mx-auto max-w-7xl">
		<Divider class="mt-0 sm:mt-0" />
		<div class="min-h-[calc(100dvh_-_16rem)] w-full">
			<h2 class="pb-4 text-3xl font-bold">Projects</h2>
			<ul class="flex flex-col gap-2 font-mono sm:gap-1">
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
		</div>
		<Divider />
		<section>
			<h2 class="pb-4 text-3xl font-bold">Contact</h2>
			<ContactForm {contactForm} />
		</section>
	</div>
</div>

<style>
	.gradient-blur {
		mask: linear-gradient(0deg, black, transparent 80%);
	}

	.hero-text {
		opacity: 1;
		transition: opacity 1s 5s ease-in-out;
	}

	@starting-style {
		.hero-text {
			opacity: 0;
		}
	}
</style>

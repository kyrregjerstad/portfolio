<script lang="ts">
	import Blob from './Blob.svelte';

	import ContactForm from '@/components/ContactForm.svelte';
	import Divider from '@/components/Divider.svelte';
	import List from '@/components/List.svelte';
	import Technologies from '@/components/Technologies.svelte';
	import { MapPin } from 'lucide-svelte';
	import type { PageData } from './$types';
	import GitHubIconAnimated from '@/components/icons/GitHubIconAnimated.svelte';
	import LinkedInAnimated from '@/components/icons/LinkedInIconAnimated.svelte';
	import TwitterIconAnimated from '@/components/icons/TwitterIconAnimated.svelte';

	type Props = {
		data: PageData & {
			firstVisit: boolean; // why is svelte not picking this up?
		};
	};
	const { data }: Props = $props();

	const { contactForm } = data;
	const { projects, heading, description } = data.page;

	const experiments = [
		{
			title: 'Particles',
			slug: '/experiments/particles',
		},
	];
</script>

<Blob />
<div class="sticky top-16 mx-auto h-full w-full max-w-7xl sm:top-16">
	<div
		class="relative flex min-h-[calc(100dvh_-_8rem)] w-full flex-col sm:min-h-[calc(100dvh_-_8rem)] sm:justify-center sm:py-8"
	>
		<div class="hero-text sm:text-justify">
			<h1
				class="flex items-end gap-2 text-pretty break-words text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl"
			>
				Hei, I'm Kyrre!
			</h1>
			<span class="flex items-center gap-1 text-pretty text-sm font-normal">
				<MapPin size={12} />
				Berlin
			</span>

			<h2 class="text-pretty pb-8 pt-4 text-lg sm:pb-12 lg:text-xl">
				I build full-stack web applications with TypeScript, specializing in <strong>SvelteKit</strong> and
				<strong>Next.js</strong>.
			</h2>
			<!-- TODO: idea - make the text crumble or some other effect when the gradient comes over the text -->
			<p class="prose text-lg">
				I develop clean, performant solutions that solve real business problems. My work spans from crafting intuitive
				user interfaces to designing scalable backend systems. Check out my projects below to see how I've helped
				companies ship better products faster.
			</p>

			<div class="flex items-center gap-3 pt-8">
				<a href="https://github.com/kyrregjerstad" target="_blank" class="transition-transform hover:scale-110">
					<span class="sr-only">GitHub</span>
					<GitHubIconAnimated size={2.5} />
				</a>
				<a
					href="https://www.linkedin.com/in/kyrre-gjerstad/"
					target="_blank"
					class="transition-transform hover:scale-110"
				>
					<span class="sr-only">LinkedIn</span>
					<LinkedInAnimated size={2.5} />
				</a>
				<a href="https://www.twitter.com/kyrregjerstad" target="_blank" class="transition-transform hover:scale-110">
					<span class="sr-only">Twitter</span>
					<TwitterIconAnimated size={2.3} />
				</a>
			</div>
		</div>
	</div>
</div>
<div class="bg-background relative z-[2] w-full">
	<div class="from-background gradient-blur dots absolute -top-64 h-64 w-full bg-gradient-to-t to-transparent"></div>
	<div class="mx-auto max-w-7xl">
		<Divider class="!mt-0" delay={data.firstVisit ? 3600 : 0} />
		<div>
			<h2 class="pb-4 text-3xl font-bold">Technologies</h2>
			<Technologies />
		</div>
		<Divider />
		<div>
			<h2 class="pb-4 text-3xl font-bold">Projects</h2>
			<List items={projects.map((project) => ({ ...project, slug: `/projects/${project.slug}` }))} />
		</div>
		<Divider />
		<section>
			<h2 class="pb-4 text-3xl font-bold">Experiments</h2>
			<List items={experiments} />
		</section>
		<Divider />
		<section>
			<h2 class="pb-4 text-3xl font-bold">Contact</h2>
			<ContactForm {contactForm} />
		</section>
	</div>
</div>

<style>
	.dots {
		background-image: radial-gradient(transparent 1px, #10100e 1px);
		background-size: 4px 4px;
		@apply z-40 bg-transparent backdrop-blur-sm;
	}

	.gradient-blur {
		mask: linear-gradient(0deg, black, transparent 80%);
	}

	.hero-text {
		opacity: 1;
		transition: opacity 1s 3s ease-in-out;
	}

	@starting-style {
		:global([data-firstVisit='true'] .hero-text) {
			opacity: 0;
		}
	}
</style>

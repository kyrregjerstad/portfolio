<script lang="ts">
	import ContactForm from '@/components/ContactForm.svelte';
	import Divider from '@/components/Divider.svelte';
	import List from '@/components/List.svelte';
	import Technologies from '@/components/Technologies.svelte';
	import type { PageProps } from './$types';
	import Blob from './Blob.svelte';
	import HeroSection from './HeroSection.svelte';
	import GradientBlurDots from './GradientBlurDots.svelte';

	let { data }: PageProps = $props();
	let contactForm = $derived(data.contactForm);
	let projects = $derived(data.page.projects);

	const experiments = [
		{
			title: 'Particles',
			slug: '/experiments/particles',
		},
	];
</script>

<Blob />
<HeroSection initialLikes={data.totalLikes} />
<div class="bg-background relative z-[2] w-full">
	<GradientBlurDots />
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

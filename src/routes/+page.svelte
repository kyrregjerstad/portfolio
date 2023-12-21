<script>
	import HorizontalRuler from "$components/HorizontalRuler.svelte";
	import ProjectsSection from "$components/ProjectsSection.svelte";
	import Button from "$components/buttons/Button.svelte";
	import GitHubContributions from "$components/contributions/GitHubContributions.svelte";
	import ContactForm from "$components/forms/ContactForm.svelte";
	import Footer from "$components/layout/Footer.svelte";

	export let data;

	$: ({ projects, description, heading } = data.pageData);
</script>

<div class="wrapper">
	<section>
		<h1 class="page-title">{heading}</h1>
		<p>{description}</p>
		<Button text="Let's Talk" />
	</section>
	<HorizontalRuler />
	<ProjectsSection {projects} />
	<HorizontalRuler />
	<GitHubContributions data={data.gitHubContributions.data} />
	<HorizontalRuler />
	<!-- 
	<section>
		<h2>Contact:</h2>
		<ContactForm data={data.form} />
	</section> -->
</div>
<Footer />

<style lang="postcss">
	h1,
	p {
		margin-block: 2rlh;
	}

	.wrapper {
		overflow: hidden;
		margin-block: 2rem;
	}

	.page-title {
		font-size: 4rem;
	}
</style>

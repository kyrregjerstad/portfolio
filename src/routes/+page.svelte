<script>
	import HorizontalRuler from "$components/HorizontalRuler.svelte";
	import GitHubContributions from "$components/contributions/GitHubContributions.svelte";
	import Button from "$components/buttons/Button.svelte";
	import ContactForm from "$components/forms/ContactForm.svelte";
	import Footer from "$components/layout/Footer.svelte";
	import ProjectsSection from "$components/ProjectsSection.svelte";
	import AnimatedSvg from "$components/AnimatedSvg.svelte";

	export let data;
</script>

<div class="wrapper">
	<section>
		<h1 class="page-title">Hello World!</h1>
		<p>
			If you're here, you're probably looking for a front-end developer who can think outside the box, colour outside
			the lines and mix metaphors... Well, you're in luck!
		</p>

		<p>
			I'm Kyrre Gjerstad, a creative professional from Norway, currently living in Berlin. I have a passion for making
			things and exploring new technologies.
		</p>

		<p>Are you ready to bring your next project to life?</p>

		<Button text="Let's Talk" />
	</section>
	<HorizontalRuler />

	<ProjectsSection />
	<HorizontalRuler />
	<GitHubContributions data={data.gitHubContributions.data} />
	<HorizontalRuler />

	<section>
		<h2>Contact:</h2>
		<ContactForm data={data.form} />
	</section>
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

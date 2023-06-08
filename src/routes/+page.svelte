<script>
	import HorizontalRuler from "$components/HorizontalRuler.svelte";
	import GitHubContributions from "$components/contributions/GitHubContributions.svelte";
	import Button from "$components/buttons/Button.svelte";
	import ContactForm from "$components/forms/ContactForm.svelte";
	import Footer from "$components/layout/Footer.svelte";

	export let data;
</script>

<div class="wrapper">
	<section>
		<h1 class="page-title">Hello World!</h1>
		<p>
			If you're here, you're probably looking for a front-end developer who can think outside the box, colour outside
			the lines and mix metaphors... Well, you're in luck! <br />
			<br />I'm Kyrre Gjerstad, a creative professional from Norway, currently living in Berlin. I have a passion for
			making things and exploring new technologies.
		</p>

		<p>Are you ready to bring your next project to life?</p>

		<Button text="Let's Talk" />
	</section>
	<HorizontalRuler />

	<section>
		<h2>Projects:</h2>
		<ul>
			<li><a href="./Projects/Spell">Spell Web</a></li>
			<li><a href="./Projects/okolors">OKolors</a></li>
			<li><a href="./Projects/ai-web">AI // WEB</a></li>
			<li><a href="./Projects/Rainy_Days">Rainy Days</a></li>
			<li><a href="./Projects/ARTic_Exploration">ARTic Exploration</a></li>
			<li><a href="./Projects/RENAME">R.E.N.A.M.E</a></li>
			<li><a href="./Projects/Futeum">Futeum</a></li>
			<li><a href="./Projects/Square_Eyes">Square Eyes</a></li>
		</ul>
	</section>
	<HorizontalRuler />
	<GitHubContributions data={data.gitHubContributions.data} />
	<HorizontalRuler />

	<section>
		<h2>Contact:</h2>
		<ContactForm data={data.form} />
	</section>
</div>
<Footer />

<style>
	a:hover {
		font-weight: 800;
	}

	li {
		transition: transform calc(var(--transition-time) / 4) ease-in-out;
	}
	li:has(a):hover {
		transform: translate(0.5rem, 0);
	}

	li:hover::marker {
		content: "> ";
	}
	.wrapper {
		overflow: hidden;
	}

	.page-title {
		font-size: 4rem;
		margin-block-start: 2rem;
	}
</style>

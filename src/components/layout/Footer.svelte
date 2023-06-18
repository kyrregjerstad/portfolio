<script>
	import AnimatedIconLinkedIn from "$components/AnimatedIconLinkedIn.svelte";
	import AnimatedIconTwitter from "$components/AnimatedIconTwitter.svelte";
	import Icon from "@iconify/svelte";
	import AnimatedIconGitHub from "$components/AnimatedIconGitHub.svelte";

	const year = new Date().getFullYear();
</script>

<footer>
	<p>Kyrre Gjerstad - {year}</p>
	<div class="social-icons">
		<a href="https://www.linkedin.com/in/kyrre-gjerstad/" target="_blank">
			<!-- <Icon icon="simple-icons:linkedin" height="40" /> -->
			<AnimatedIconLinkedIn />
			<span class="visually-hidden">LinkedIn</span>
		</a>
		<a href="https://github.com/kyrregjerstad" target="_blank">
			<AnimatedIconGitHub size={4.5} />
			<!-- <Icon icon="simple-icons:github" /> -->
			<span class="visually-hidden">GitHub</span>
		</a>
		<a href="https://www.twitter.com/kyrregjerstad" target="_blank">
			<AnimatedIconTwitter />
			<span class="visually-hidden">Twitter</span>
		</a>
	</div>
</footer>

<style>
	footer {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;

		margin-block-start: 8rem;
	}

	.social-icons {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 1.5rem;
		margin-block: 1rem;

		font-size: 2rem;
	}

	a {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	p {
		margin-block: unset;
	}
</style>

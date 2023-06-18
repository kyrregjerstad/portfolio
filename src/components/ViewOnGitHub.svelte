<script>
	import AnimatedIconGitHub from "$components/AnimatedIconGitHub.svelte";
	import Icon from "@iconify/svelte";

	export let href = "";
	export let hover = false;
</script>

<div class="wrapper" on:mouseenter={() => (hover = true)} on:mouseleave={() => (hover = false)}>
	<a {href}>
		<AnimatedIconGitHub size={3.5} {hover} />
		<!-- <Icon icon="akar-icons:github-fill" height={25} /> -->
		View on GitHub
	</a>
</div>

<style>
	a {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 1.25rem;
	}
</style>

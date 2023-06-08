<script>
	import Icon from "@iconify/svelte";

	export let href = "";
</script>

<div>
	<a {href}>
		<Icon icon="akar-icons:github-fill" height={25} />
		View on GitHub
	</a>
</div>

<style>
	a {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>

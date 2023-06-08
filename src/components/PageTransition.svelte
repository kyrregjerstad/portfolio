<script lang="js">
	import { fly } from "svelte/transition";
	import statefulSwap from "../lib/statefulSwap";

	const { onOutro } = statefulSwap("first");

	export let pathname = "";
</script>

{#key pathname}
	<div out:fly={{ x: -500, duration: 300 }} in:fly={{ x: 500, duration: 300, delay: 300 }} on:outroend={onOutro}>
		<slot />
	</div>
{/key}

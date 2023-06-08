<script lang="js">
	import { fly, scale } from "svelte/transition";
	import { quintOut } from "svelte/easing";
	import statefulSwap from "../lib/statefulSwap.js";
	import { get } from "svelte/store";

	const { onOutro, transitionTo, state } = statefulSwap("first");

	export let pathname = "";
</script>

<!-- out:fly={{ x: 1000, duration: 5000 }} in:fly={{ x: -1000, duration: 2500, delay: 500 }} -->
{#key pathname}
	<div
		out:fly={{ x: -500, duration: 300 }}
		in:fly={{ x: 500, duration: 300, delay: 300 }}
		on:outroend={onOutro}
	>
		<slot />
	</div>
{/key}

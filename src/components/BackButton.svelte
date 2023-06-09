<script lang="ts">
	import "@fontsource/material-icons-outlined";
	import { blur } from "svelte/transition";

	function onClick(e: MouseEvent) {
		const target = e.currentTarget as HTMLElement;
		target.style.transform = "scale(0.9)";
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<a href="/" transition:blur on:click={onClick}> <span class="material-icons-outlined"> chevron_left </span></a>

<style lang="postcss">
	.material-icons-outlined {
		font-size: 3rem; /* Preferred icon size */
		padding: 0;
		margin: 0;
		font-family: "Material Icons Outlined";
		font-weight: normal;
		font-style: normal;
		display: inline-block;
		text-transform: none;
		letter-spacing: normal;
		word-wrap: normal;
		white-space: nowrap;
		direction: ltr;
		-webkit-font-smoothing: antialiased;
		text-rendering: optimizeLegibility;
		-moz-osx-font-smoothing: grayscale;
	}

	a {
		position: fixed;
		top: 1.2rem;
		left: 1.1rem;
		z-index: 1000;
		transition: transform calc(var(--transition-time) / 4) ease-in-out;
	}

	@media (min-width: 45rem) {
		a {
			top: 4rem;
			left: 4rem;
		}
	}

	a:hover {
		transform: scale(1.1) translateX(-0.1rem);
	}
</style>

<script>
	import "@fontsource/material-icons-outlined";
</script>

<span class="material-icons-outlined"> open_in_new </span>

<style>
	.material-icons-outlined {
		font-size: 2rem; /* Preferred icon size */
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

	div {
		position: fixed;
		top: 4rem;
		left: 4rem;
		transition: transform calc(var(--transition-time) / 4) ease-in-out;
	}

	div:hover {
		transform: scale(1.1) translateX(-0.1rem);
	}
</style>

<script>
	// @ts-nocheck

	import { fade, fly } from "svelte/transition";
	import { onMount } from "svelte";

	let visible = false;
	export let size = "medium";

	onMount(() => {
		visible = true;
	});
</script>

<div class:small={size === "small"} class:medium={size === "medium"} class:large={size === "large"}>
	<hr />
</div>

<style>
	.small {
		margin-block: 1rem;
	}
	.medium {
		margin-block: 3rem;
	}
	.large {
		margin-block: 5rem;
	}

	hr {
		width: 66.66%;
	}

	@media (min-width: 45rem) {
		.small {
			margin-block: 3rem;
		}
		.medium {
			margin-block: 5rem;
		}
		.large {
			margin-block: 6rem;
		}
	}
</style>

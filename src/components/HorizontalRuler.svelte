<script lang="ts">
	export let size = "medium";
</script>

<div class:small={size === "small"} class:medium={size === "medium"} class:large={size === "large"}>
	<hr />
</div>

<style lang="postcss">
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

	@media (--viewport-sm) {
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

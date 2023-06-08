<script>
	import HorizontalRuler from "$components/HorizontalRuler.svelte";
</script>

<div class="page">
	<section class="left-side">
		<slot name="page-text" />
		<HorizontalRuler />
		<slot name="page-links" />
	</section>
	<section>
		<slot name="page-images" />
	</section>
</div>

<style>
	.page {
		position: relative;
		display: grid;
		gap: 5rem;
		width: 100%;
	}

	:global(.right-side) {
		display: grid;
		gap: 5rem;
		grid-column-start: 2;
	}

	:global(img) {
		box-shadow: var(--img-shadow);
		max-width: 100%;
		border-radius: 0.5rem;
		transition: box-shadow var(--transition-time) ease-in-out;
	}

	:global(h3) {
		display: inline-block;
		transform-origin: left;
		transition: transform calc(var(--transition-time) / 4) ease-in-out;
	}

	:global(h1) {
		margin-block-start: 3rem;
	}

	@media (min-width: 45rem) {
		.left-side {
			position: sticky;
			align-self: start;
			top: 0;
			z-index: 1000;
		}

		.page {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		}

		:global(h1) {
			margin-block-start: unset;
		}
	}
</style>

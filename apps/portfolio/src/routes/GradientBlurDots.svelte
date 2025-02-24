<div
	class="from-background gradient-blur dots pointer-events-none absolute -top-48 h-48 w-full bg-gradient-to-t to-transparent"
></div>

<style>
	.dots {
		background-image: radial-gradient(transparent 1px, #10100e 1px);
		background-size: 4px 4px;
		@apply z-40 bg-transparent backdrop-blur-sm;
	}

	.gradient-blur {
		mask: linear-gradient(0deg, black, transparent 80%);
	}
</style>

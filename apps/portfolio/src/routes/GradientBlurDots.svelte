<div
	class="from-background gradient-blur dots bg-linear-to-t pointer-events-none absolute -top-48 h-48 w-full to-transparent"
></div>

<style lang="postcss">
	@reference "tailwindcss";

	.dots {
		background-image: radial-gradient(transparent 1px, #10100e 1px);
		background-size: 4px 4px;
		@apply z-40 bg-transparent backdrop-blur-sm;
	}

	.gradient-blur {
		mask: linear-gradient(0deg, black, transparent 80%);
	}
</style>

<div class="right-side">
	<slot />
</div>

<style>
	.right-side {
		display: grid;
		display: none;
		/* padding-left: 3rem;
		padding-right: 2rem; */
		gap: 5rem;
		/* position the second column next to the first column */
		grid-column-start: 2;
	}
	:global(img) {
		box-shadow: var(--img-shadow);
		/* max-width: 100%; */
		border-radius: 0.5rem;
		transition: box-shadow var(--transition-time) ease-in-out;
	}
</style>

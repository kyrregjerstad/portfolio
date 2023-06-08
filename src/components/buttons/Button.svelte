<script>
	// @ts-nocheck

	export let text = "Button";

	function scrollToContact() {
		const contactSection = document.querySelector("#contact");
		const nameInput = document.querySelector("#name");
		contactSection.scrollIntoView({ behavior: "smooth" });

		setTimeout(() => {
			nameInput.focus();
		}, 800);
	}
</script>

<button on:click={scrollToContact}>
	{text}
</button>

<style>
	button {
		font-size: 1.5rem;
		padding: 1rem 2rem;
		background-color: transparent;
		border: 1px solid var(--font-color);
		color: var(--font-color);
		border-radius: 0.1rem;
		cursor: pointer;
		font-family: "JetBrains Mono", monospace;
		font-weight: 100;

		margin-top: 1.5rem;

		background: linear-gradient(
			var(--background-color) 0%,
			var(--background-color) 50%,
			var(--font-color) 50%,
			var(--font-color) 100%
		);
		background-size: 200% 200%;
		background-position: right top;

		transition: all 150ms ease-in-out;
	}

	button:hover {
		/* background-color: var(--font-color); */
		color: var(--background-color);
		background-position: right bottom;
	}
</style>

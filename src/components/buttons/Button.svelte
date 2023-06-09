<script lang="ts">
	export let text = "Button";

	function scrollToContact() {
		const contactSection = document.querySelector("#contact") as HTMLAnchorElement;
		const nameInput = document.querySelector("#name") as HTMLInputElement;
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
		font-variation-settings: var(--font-thin-settings);
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
		color: var(--background-color);
		background-position: right bottom;
		font-variation-settings: var(--font-hover-settings);
	}
</style>

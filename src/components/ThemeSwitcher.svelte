<script lang="ts">
	import { onMount } from "svelte";
	import { textEffect } from "$lib/animations/text-effect";

	export let fontSize = 16;
	let theme = "dark";
	let isChecked = true;
	let text = "dark mode";

	const uniqueID = Math.floor(Math.random() * 100);

	onMount(() => {
		const themePreference = localStorage.getItem("theme");
		if (themePreference) {
			isChecked = themePreference === "dark";
			updateTheme(isChecked);
		}
	});

	function handleClick() {
		isChecked = !isChecked;
		updateTheme(isChecked);
		textEffect(text, (effect) => {
			text = effect;
		});
		localStorage.setItem("theme", isChecked ? "dark" : "light");
	}

	function updateTheme(isChecked: boolean) {
		theme = isChecked ? "dark" : "light";
		text = isChecked ? "dark mode" : "light mode";
		document.documentElement.setAttribute("data-theme", theme);
	}
</script>

<div id="button-wrapper">
	<div class="s s--slider" style="font-size:{fontSize}px">
		<span id={`switch-${uniqueID}`}>{text}</span>
		<button role="switch" aria-labelledby={`switch-${uniqueID}`} aria-checked={isChecked} on:click={handleClick} />
	</div>
</div>

<style>
	:root {
		--accent-color: #404039;
		--gray: #777c84;
	}

	button {
		padding: 0;
	}

	.s--slider {
		display: flex;
		align-items: center;
	}

	.s--slider button {
		width: 3rem;
		height: 1.6rem;
		position: relative;
		margin: 0 0 0 0.5rem;
		background: var(--gray);
		border: none;
		cursor: pointer;
		transition: background-color var(--transition-time) ease-in-out;
	}

	.s--slider button::before {
		content: "";
		position: absolute;
		width: 1.3rem;
		height: 1.3rem;
		background: var(--color-primary-light);
		top: 0.13rem;
		right: 1.5rem;
		transition: transform calc(var(--transition-time) / 2) ease-in-out;
	}

	.s--slider button[aria-checked="true"] {
		background-color: var(--accent-color);
	}

	.s--slider button[aria-checked="true"]::before {
		transform: translateX(1.3rem);
		transition: transform calc(var(--transition-time) / 2) ease-in-out;
	}

	.s--slider button {
		border-radius: 1.5rem;
	}

	.s--slider button::before {
		border-radius: 100%;
	}

	.s--slider button:focus {
		border-radius: 1.5rem;
	}

	#button-wrapper {
		position: fixed;
		top: 2rem;
		right: 2rem;

		z-index: 1000;
	}

	@media (min-width: 45rem) {
		#button-wrapper {
			top: 4rem;
			right: 4rem;
		}
	}
</style>
